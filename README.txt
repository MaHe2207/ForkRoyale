Fork Royale v1.0.9 – Direkt aus der Essenssammlung als gegessen markieren.

UPDATE AUF GITHUB PAGES:
1. index.html und sw.js im Repository mahe2207/ForkRoyale ersetzen.
2. Commit changes.
3. Nach abgeschlossenem GitHub-Pages-Deployment App neu öffnen (Version 1.0.9 prüfen).

FUNKTION:
In der Essenssammlung bei einem Gericht „Als gegessen markieren“ wählen, Datum auswählen und speichern.
Das Gericht erhält einen neuen Historieneintrag. Ist es im Wochenplan, wird es beim direkten Abschließen aus dem Plan entfernt. Beide Hot-or-Not-Stimmen werden gelöscht, beide Ranglistenplätze bleiben erhalten. Auch existierende Foto-Verweise bleiben erhalten.

config.js, firebase-adapter.js und Firestore-Regeln bleiben unverändert. Keine Daten löschen oder zurücksetzen.
