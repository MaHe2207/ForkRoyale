# Fork Royale – Firebase-Aktivierung v1.0.4

Dieses Paket behebt einen Cache-Fehler, durch den eine frisch hochgeladene `config.js` auf Android weiterhin als alte, leere Demokonfiguration geladen wurde.

## Upload bei GitHub

1. Dieses ZIP entpacken.
2. Im Repository `mahe2207/ForkRoyale` die drei Dateien `index.html`, `config.js` und `sw.js` direkt ins Stammverzeichnis hochladen; vorhandene Versionen ersetzen.
3. `Commit changes` und abwarten, bis GitHub Pages erfolgreich veröffentlicht wurde.
4. Auf Android Fork Royale schließen und neu starten. Falls noch die alte Version angezeigt wird: in Chrome `https://mahe2207.github.io/ForkRoyale/?v=1.0.4` öffnen, dann neu laden. Die Version unten in der App muss `v1.0.4` anzeigen.

## Prüfung

Unter `https://mahe2207.github.io/ForkRoyale/config.js?v=1.0.4` sollte beim Öffnen im Browser `window.FORK_CONFIG` mit `firebase` und den beiden UIDs zu sehen sein (nicht `firebase: null`).

Nach dem Laden sollte der Login erscheinen. Melden sich die Nutzer an und sind die Firestore-Regeln veröffentlicht, wird in Firestore das gemeinsame Dokument `rooms/main` angelegt.

Falls noch Demo angezeigt wird: Sicherstellen, dass `index.html`, `config.js`, `sw.js` wirklich im Repository-Stammverzeichnis liegen. Neu laden oder Browser-Website-Daten für diese Domain löschen – Achtung: Lokale Demodaten gehen beim Löschen der Website-Daten verloren.

Die Firebase-Web-Konfiguration ist öffentlich, Passwörter und private Schlüssel gehören nicht in GitHub.
