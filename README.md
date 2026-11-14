# Fork Royale – PWA v1.0.0

Eine installierbare Progressive Web App für genau zwei Personen, die Gerichte in eigenen Boxranglisten bewerten, in einem gemeinsamen Hot-or-Not-Modus matchen und in einen wiederkehrenden Wochenplan legen.

## Start in 3 Minuten: lokale Demo über GitHub Pages

1. Neues GitHub-Repository erstellen, z. B. `fork-royale`.
2. **Alle Dateien und den Ordner `icons` aus diesem Paket** in das Repository-Hauptverzeichnis hochladen (nicht die ZIP-Datei selbst).
3. Unter **Settings → Pages → Build and deployment → Deploy from a branch** wählen, Branch `main`, Ordner `/ (root)`, **Save**.
4. Nach der Veröffentlichung die GitHub-Pages-Adresse `https://BENUTZERNAME.github.io/fork-royale/` im Browser öffnen.
5. Unter **Einstellungen → App installieren** den Installationsdialog öffnen. Auf iOS: Safari → Teilen → Zum Home-Bildschirm.

Die Demo verwendet zwei Profilnamen, speichert aber **nur in diesem Browser** (`localStorage`). Die beiden Smartphones sind damit **noch nicht synchron**. Die HTML-Datei direkt per `file://` zu öffnen reicht für die PWA-Installation nicht; HTTPS oder localhost ist nötig.

## Echten Zwei-Personen-Modus mit Firebase aktivieren

### Schritt 1 – Firebase einrichten

1. Neues Projekt über https://console.firebase.google.com/ anlegen.
2. **Authentication → Sign-in method → Email/Password** aktivieren.
3. Unter **Authentication → Users** zwei Benutzer mit unterschiedlichen E-Mail-Adressen und Passwörtern anlegen. Die **UID** jedes Benutzers notieren (Person 1 = `a`, Person 2 = `b`). Registrierung über die App ist absichtlich nicht möglich.
4. **Firestore Database** erstellen (Produktionsmodus, geeignete Region wählen).
5. Eine **Web-App** in den Projekteinstellungen registrieren und die Firebase-Konfiguration kopieren.
6. Falls nötig unter **Authentication → Settings → Authorized domains** den Domainnamen `BENUTZERNAME.github.io` hinzufügen.
7. Für Uploads von eigenen Essensfotos **Storage** aktivieren und den `storageBucket` in der Web-Konfiguration übernehmen. **Achtung: Firebase Cloud Storage erfordert seit 2026 den Blaze-Tarif (Pay as you go); Kostenkontrolle und Budgetwarnungen einrichten.** Ohne Storage funktionieren die Anwendung und Fotos über bereits vorhandene URL-Bilder; das Hochladen eigener Fotos erzeugt einen Fehler.

### Schritt 2 – Firebase-Sicherheitsregeln einsetzen

Im Firebase-Projekt:

- **Firestore Database → Rules:** Inhalt aus `firestore.rules` einsetzen. `REPLACE_WITH_UID_A` und `REPLACE_WITH_UID_B` durch die beiden echten UIDs ersetzen, Regeln veröffentlichen.
- **Storage → Rules:** Inhalt aus `storage.rules` einsetzen, dieselben Platzhalter ersetzen, Regeln veröffentlichen.
- Nicht die temporären Test-Regeln nutzen: Sie könnten anderen Zugriff auf eure Daten ermöglichen.

Das Datenmodell benutzt zurzeit den einen Firestore-Datensatz `rooms/main` für die gemeinsame, kleine Sammlung. Für eine wesentlich größere Sammlung oder sehr schnelle gleichzeitige Aktionen sollte das Modell später auf mehrere Dokumente/Collections verteilt werden.

### Schritt 3 – `config.js` bearbeiten

Die beiliegende `config.js` enthält ein auskommentiertes Beispiel. So sieht eine aktivierte Konfiguration aus:

```js
window.FORK_CONFIG = {
  firebase: {
    apiKey: 'EURE_WEB_API_KEY',
    authDomain: 'EUER_PROJEKT.firebaseapp.com',
    projectId: 'EUER_PROJEKT',
    storageBucket: 'EUER_PROJEKT.firebasestorage.app',
    appId: 'EURE_FIREBASE_APP_ID'
  },
  uids: {
    a: 'FIREBASE_UID_PERSON_1',
    b: 'FIREBASE_UID_PERSON_2'
  },
  room: 'main'
};
```

Die Firebase-Web-Konfiguration und UID-Prüfungen in der App sind **kein geheimer Zugangsschutz**. Den Zugriff erzwingen allein Firebase Authentication und die veröffentlichten Security Rules. **Niemals ein Admin-SDK-, Service-Account- oder GitHub-Passwort in `config.js` eintragen.**

Diese geänderte `config.js` committen und GitHub Pages aktualisieren. Beide Personen melden sich auf ihren eigenen Smartphones an. Jede Person kann ausschließlich über ihre zugewiesene Rolle abstimmen; ein Demo-Profilwechsel ist im Firebase-Modus deaktiviert.

## Spielregeln

- **Arena:** Zwei persönliche Ranglisten, neue Gerichte starten am Ende. Zufällige Duelle gegen Essen maximal zehn Plätze höher. Gewinnt der Herausforderer, steigt er auf den Rang des Gegners.
- **Hot or Not:** Die Vereinigung der obersten N *verfügbaren* Gerichte beider Ranglisten; Standard Top 20, gemeinsam einstellbar. Endlose Runden, neue unbewertete Top-Kandidaten zuerst.
- **Matches:** Hot + Hot oder ein einziges Super-Hot ergeben ein Match. Ein Essen in der Matchliste darf weiterhin kämpfen.
- **Super-Hot-Feueralarm:** Wird der anderen Person erst angezeigt, wenn sie das betreffende Essen auf ihrer Hot-or-Not-Karte zum ersten Mal nach dem Super-Hot sieht. Animiert bis zum Antippen, dann als gesehen markiert.
- **It's a Match:** Erscheint, wenn die zweite Person mit Hot ein Match erzeugt. Bleibt sichtbar bis zum Antippen.
- **Top-N-Ausstieg:** Stimmen bleiben zehn Tage verborgen gültig; danach laufen Stimmen und Match ab, wenn das Gericht nicht zurückkehrt.
- **Wochenplan:** Immer Montag bis Sonntag, ohne Datumsbindung. Mehrere Essen pro Tag; nur Matches dürfen hinein. Geplante Essen werden von der Auswahl ausgenommen.
- **Als gegessen markieren:** Datum ist Pflicht; Eintrag geht in die Historie, Hot-or-Not-Stimmen werden zurückgesetzt, Ranglistenplätze bleiben erhalten.

## Installation / PWA-Technik

- `index.html`: komplette Benutzeroberfläche (kein Build-Schritt).
- `manifest.webmanifest`: Name, Start-URL, Anzeigeart und Icons.
- `sw.js`: App-Shell-Offlinecache (`v1.0.0`); dynamische Firebase-Daten und Auth-Tokens werden **nicht** im Service Worker gespeichert.
- `firebase-adapter.js`: optionales Firebase-Login, Firestore-Synchronisierung mit Transaktionen, Bilder-Upload.
- `config.js`: öffentliche Web-Konfiguration; standardmäßig **nicht verbunden**.
- `icons/`: App-Icon (Gabel mit Krone und Umhang), vollständiges Logo und maskable Icon.

Die installierte Web-App kann mit zwischengespeicherter Oberfläche offline starten. **Firebase-Login, Uploads und transaktionsbasierte Änderungen erfordern Internet.** Es gibt noch keine vollständig getestete Offline-Synchronisierung für Cloud-Änderungen und keine Push-Benachrichtigungen außerhalb der geöffneten App.

## Grenzen dieser ersten PWA-Version

- Firebase kann ohne eure Konfiguration und zwei echte Accounts nicht Ende-zu-Ende getestet werden. Getestet sind die lokale App-Funktionalität, die HTML-/JS-Syntax und die geräteoptimierte Oberfläche.
- Ein einzelnes Firestore-Dokument eignet sich für kleine private Sammlungen, ist aber nicht für hohe Schreibfrequenzen oder sehr große Datenmengen ausgelegt. Firestore begrenzt Dokumente auf 1 MiB; die App begrenzt die Nutzdaten auf ca. 850 kB.
- `getDownloadURL` für Firebase-Fotos erzeugt abrufbare Links mit Tokens. Wer einen solchen Link besitzt, kann das Foto ggf. auch außerhalb der App öffnen. Keine sensiblen Fotos hochladen.
- Externe Demo-Essensfotos benötigen Internet. Eigene Bilder werden lokal verkleinert, dann hochgeladen.
- Beim Update des Service Workers kann ein einmaliges Neuladen nötig sein. Vor produktiver Verwendung empfiehlt sich ein Test beider Konten auf echten Geräten.

## Version

**1.0.0** – Fork Royale Branding, Installationsmanifest, App-Icon, Service Worker, zwei echte Firebase-Logins und vorbereitete Live-Synchronisation. Basis: FoodFight-Mockup v0.9.0.
