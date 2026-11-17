FORK ROYALE v1.0.8 – BUGFIX LIVE-SYNCHRONISIERUNG
=================================================

BEHOBEN:
Waehrend eine Person ein neues Gericht anlegt oder ein vorhandenes bearbeitet,
wurden Eingabefelder und Fotoauswahl durch eine Firestore-Aktualisierung vom
zweiten Smartphone ungewollt zurueckgesetzt. Das geoeffnete Formular bleibt nun
beim Eingang von Live-Aktualisierungen unveraendert. Laufende Eingaben, Tags,
Rezeptquelle, Dateiauswahl und Eingabefokus bleiben erhalten.

Zusaetzlich: Wenn die andere Person ein gerade bearbeitetes Gericht loescht,
verhindert die App, dass dieses Gericht beim Speichern unbeabsichtigt neu angelegt wird.

GITHUB-UPDATE:
1. ZIP entpacken.
2. Ausschliesslich index.html und sw.js ins Stammverzeichnis des GitHub-
   Repositories mahe2207/ForkRoyale hochladen und bestehende Dateien ersetzen.
3. Commit changes waehlen und die GitHub-Pages-Veroeffentlichung abwarten.
4. Installierte PWA schliessen und erneut oeffnen. Version v1.0.8 pruefen.

UNVERAENDERT:
config.js, firebase-adapter.js, Firestore-Regeln, bestehende Gerichte,
Bilder, Ranglisten, Bewertungen und Wochenplan. Keine Datenmigration notwendig.

TEST:
Auf Smartphone 1 ein Gericht anlegen/bearbeiten und Text und Foto auswaehlen.
Gleichzeitig auf Smartphone 2 einen Kampf oder eine Bewertung durchfuehren.
Auf Smartphone 1 muessen Formular, Text und Foto erhalten bleiben.

HINWEIS: Browser-Funktionstests haben den Firebase-Snapshot-Ablauf simuliert.
Ein Live-Test auf zwei echten Geraeten ist nach dem Hochladen erforderlich.
