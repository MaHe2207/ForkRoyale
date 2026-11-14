// Firebase-Modus erst aktivieren, wenn alle Werte eingesetzt sind.
// Die Firebase-Web-Konfiguration ist öffentlich. Der Zugriff wird durch
// Firebase Authentication und die Firestore-/Storage-Sicherheitsregeln geschützt.
window.FORK_CONFIG = {
  firebase: null,
  // Beispiel: firebase: {apiKey:'...', authDomain:'...', projectId:'...', storageBucket:'...', appId:'...'},
  uids: { a: '', b: '' }, // Firebase Authentication -> Benutzer -> UID von Person 1 und 2
  room: 'main'
};
