# Fork Royale – Installationsfix v1.0.3

Dieser Fix beseitigt die im Android-Screenshot bestätigten `HTTP 404`-Fehler für die PWA-Icons. Alle Icondateien liegen jetzt im Hauptverzeichnis, nicht mehr im Ordner `icons/`. Die bestehenden Firebase-Dateien `config.js`, `firebase-adapter.js` und alle Daten bleiben unberührt.

## Installation über GitHub-Weboberfläche

1. **ZIP entpacken.** Die ZIP-Datei selbst nicht hochladen.
2. In GitHub `mahe2207/ForkRoyale` öffnen und im Repository-Hauptverzeichnis **Add file → Upload files** wählen.
3. **Diese acht Dateien** einzeln markieren und hochladen: `index.html`, `sw.js`, `manifest.json`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `logo-full.png`. Die Bilder werden direkt ins Hauptverzeichnis hochgeladen, *nicht* in `icons/`.
4. Vorhandene Dateien gleichen Namens ersetzen; mit **Commit changes** speichern. Alle bisherigen anderen Dateien liegen lassen.
5. Warten, bis unter **Actions** der GitHub-Pages-Deploy erfolgreich ist. Seite in Chrome neu laden (gegebenenfalls zweimal wegen des Service Workers).
6. In Fork Royale auf **Installieren** tippen und **Erneut prüfen**. Die beiden Icon-Zeilen müssen `OK` anzeigen. Danach die Seite gegebenenfalls einmal neu öffnen und erneut auf **Installieren** tippen.

Direkte Kontroll-Adressen:
- https://mahe2207.github.io/ForkRoyale/icon-192.png
- https://mahe2207.github.io/ForkRoyale/icon-512.png

**Hinweis:** Der Browser entscheidet weiterhin selbst, wann er den nativen Installationsdialog bereitstellt. Dieser Fix behebt die klaren 404-Hindernisse, ist aber kein garantierter Installationszwang.
