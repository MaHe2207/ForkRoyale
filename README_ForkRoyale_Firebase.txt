FORK ROYALE – FIREBASE-VERBINDUNG

1. GitHub:
   Die Datei config.js in das Hauptverzeichnis deines Repositorys
   mahe2207/ForkRoyale hochladen und die vorhandene Datei ersetzen.
   Änderungen committen und warten, bis GitHub Pages aktualisiert ist.

2. Firebase Console:
   Projekt ForkRoyale öffnen -> Firestore Database -> Rules.
   Den INHALT der Datei firestore.rules in den Regel-Editor kopieren.
   Danach auf Publish / Veröffentlichen klicken.
   Wichtig: Nur das Hochladen von firestore.rules zu GitHub aktiviert
   die Firebase-Regeln NICHT.

3. App testen:
   https://mahe2207.github.io/ForkRoyale/
   In Chrome neu laden, gegebenenfalls die installierte PWA schließen
   und erneut öffnen. Es sollte die E-Mail/Passwort-Anmeldung erscheinen.
   Mit jedem der beiden Firebase-Konten separat anmelden.

4. Sicherheits-Hinweis:
   Es wurden ausschließlich Firebase-Web-Konfigurationswerte und
   die zwei Benutzer-UIDs eingefügt, KEINE Passwörter oder Admin-Schlüssel.
   Firestore-Regeln erlauben nur den zwei angegebenen UIDs Zugriff auf
   rooms/main. Für Bilder in Firebase Storage müssen separat Storage-Regeln
   konfiguriert werden.
