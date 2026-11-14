/* Fork Royale v1.0.0 – optionaler Firebase-Adapter, nur bei Konfiguration geladen. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut as fbSignOut} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import {getFirestore,doc,onSnapshot,runTransaction,getDoc} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-storage.js';
const clone = v => JSON.parse(JSON.stringify(v));
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const byId = v => new Map((v||[]).map(item=>[item.id,item]));
const notificationKey=n=>`${n.from}:${n.foodId}:${n.at}`;
/** Three-way merge preserves independent votes, fights, plans and incoming alerts. */
export function mergeState(remote,before,after){
  const out=clone(remote), b=before||{}, a=after||{};
  // New/edited/deleted foods without discarding foods added concurrently by the other player.
  const oldFoods=byId(b.foods), newFoods=byId(a.foods), currFoods=byId(out.foods);
  for(const id of new Set([...oldFoods.keys(),...newFoods.keys()])){
    if(same(oldFoods.get(id),newFoods.get(id)))continue;
    if(newFoods.has(id))currFoods.set(id,clone(newFoods.get(id)));
    else currFoods.delete(id);
  }
  out.foods=[...currFoods.values()];
  for(const p of ['a','b']){
    const oldRank=b.ranks?.[p]||[],newRank=a.ranks?.[p]||[],remoteRank=out.ranks?.[p]||[];
    if(!same(oldRank,newRank)){
      // An actual rank change by this player updates only this player's ladder.
      const allowed=new Set(out.foods.map(f=>f.id));
      const rank=[...newRank.filter(id=>allowed.has(id))];
      remoteRank.filter(id=>allowed.has(id)&&!rank.includes(id)).forEach(id=>rank.push(id));
      out.ranks[p]=rank;
    }
    for(const field of ['duels','names'])if(!same(b[field]?.[p],a[field]?.[p]))out[field][p]=a[field][p];
  }
  for(const k of new Set([...Object.keys(b.prefs||{}),...Object.keys(a.prefs||{})]))
    if(!same(b.prefs?.[k],a.prefs?.[k]))out.prefs[k]=a.prefs[k];
  // Subfields prevent one user's vote from overwriting the other's simultaneous vote.
  for(const id of new Set([...Object.keys(b.votes||{}),...Object.keys(a.votes||{})])){
    const pre=b.votes?.[id],post=a.votes?.[id];
    if(same(pre,post))continue;
    if(!post){delete out.votes[id];continue;}
    out.votes[id]||={};
    for(const p of ['a','b'])if(!same(pre?.[p],post?.[p])){
      if(post[p])out.votes[id][p]=clone(post[p]);else delete out.votes[id][p];
    }
    if(!Object.keys(out.votes[id]).length)delete out.votes[id];
  }
  for(const id of new Set([...Object.keys(b.outAt||{}),...Object.keys(a.outAt||{})])){
    if(same(b.outAt?.[id],a.outAt?.[id]))continue;
    if(a.outAt?.[id])out.outAt[id]=a.outAt[id];else delete out.outAt[id];
  }
  const plans=byId(out.plan),prevPlans=byId(b.plan),nextPlans=byId(a.plan);
  for(const id of new Set([...prevPlans.keys(),...nextPlans.keys()])){
    if(same(prevPlans.get(id),nextPlans.get(id)))continue;
    if(!nextPlans.has(id))plans.delete(id);
    else if(![...plans.values()].some(x=>x.foodId===nextPlans.get(id).foodId))plans.set(id,clone(nextPlans.get(id)));
  }
  out.plan=[...plans.values()];
  const hist=byId(out.history),prevHist=byId(b.history),nextHist=byId(a.history);
  for(const id of new Set([...prevHist.keys(),...nextHist.keys()])){
    if(same(prevHist.get(id),nextHist.get(id)))continue;
    if(nextHist.has(id))hist.set(id,clone(nextHist.get(id)));else hist.delete(id);
  }
  out.history=[...hist.values()];
  for(const p of ['a','b']){
    const pre=b.notifications?.[p]||[],post=a.notifications?.[p]||[],curr=out.notifications?.[p]||[];
    if(same(pre,post))continue;
    const beforeIds=new Set(pre.map(notificationKey)),afterIds=new Set(post.map(notificationKey));
    const next=curr.filter(n=>!beforeIds.has(notificationKey(n))||afterIds.has(notificationKey(n)));
    const currIds=new Set(next.map(notificationKey));
    post.forEach(n=>{const key=notificationKey(n);if(!currIds.has(key)){next.push(clone(n));currIds.add(key)}});
    out.notifications[p]=next;
  }
  // Client-only data (active user, current queue and current view) never belongs in Firestore.
  delete out.active;delete out.priority;delete out.lastPool;
  return out;
}
export function connect(config,handlers){
  const app=initializeApp(config.firebase),auth=getAuth(app),firestore=getFirestore(app),storage=getStorage(app);
  const target=doc(firestore,'rooms',config.room||'main');
  let role=null,stop=null;
  const memberRole=user=>user?.uid===config.uids.a?'a':user?.uid===config.uids.b?'b':null;
  onAuthStateChanged(auth,async user=>{
    stop?.();stop=null;role=null;
    if(!user){handlers.onStatus('login');return;}
    role=memberRole(user);
    if(!role){handlers.onStatus('denied');return;}
    handlers.onStatus('loading');
    handlers.onUser(role,user.email||'');
    try{
      await runTransaction(firestore,async tx=>{
        const existing=await tx.get(target);
        if(!existing.exists())tx.set(target,{state:handlers.emptyState()});
      });
      stop=onSnapshot(target,snap=>{
        if(snap.exists())handlers.onData(snap.data().state);
      },error=>handlers.onError(error));
    }catch(error){handlers.onError(error)}
  });
  return {
    signIn:(email,password)=>signInWithEmailAndPassword(auth,email,password),
    signOut:()=>fbSignOut(auth),
    async patch(before,after){
      if(!role||!auth.currentUser)throw Error('Nicht angemeldet');
      return runTransaction(firestore,async tx=>{
        const s=await tx.get(target);
        if(!s.exists())throw Error('Gemeinsamer Datenraum fehlt');
        const result=mergeState(s.data().state,before,after);
        const size=new Blob([JSON.stringify(result)]).size;
        if(size>850000)throw Error('Datenraum zu groß; für größere Sammlungen ist eine Aufteilung nötig.');
        tx.update(target,{state:result});
        return result;
      });
    },
    async reload(){const s=await getDoc(target);if(s.exists())handlers.onData(s.data().state)},
    async uploadImage(foodId,dataUrl){
      if(!role)throw Error('Nicht angemeldet');
      const binary=atob(dataUrl.split(',')[1]),bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
      const blob=new Blob([bytes],{type:'image/jpeg'});
      if(blob.size>2*1024*1024)throw Error('Bild ist zu groß.');
      const path=`food-images/${foodId}/${crypto.randomUUID()}.jpg`;
      const ref=storageRef(storage,path);
      await uploadBytes(ref,blob,{contentType:'image/jpeg'});
      return getDownloadURL(ref);
    },
  };
}
