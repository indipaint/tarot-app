# PROJECT NOTES - tarot-app

## Projektpfad
`C:\Users\indip\tarot-app`

## Aktueller Stand
- Splash/Black-Screen-Problem beim Wechsel zu Community behoben.
- Root-Layout auf stabile Navigation angepasst (`GestureHandlerRootView`, kein zusaetzliches manuelles Splash-Handling im Layout).
- Community Safety-Flows umgesetzt:
  - Im privaten Thread-Chat (`app/community/thread/[id].tsx`) gibt es `Melden` und `Blockieren` (bzw. `Blockierung aufheben`) im `⋮`-Menue.
  - Hinweis zu Safety-Funktionen in den Datenschutz-/Einwilligungstext vor Community-Zugang verschoben.
- Rechtliche Dokumentation fuer Artwork angelegt:
  - `ARTWORK_HISTORY.md`
  - `ARTWORK_HISTORY.txt` (Fallback, falls Markdown-Open in Cursor zickt)

## Wichtige Dateien
- `app/_layout.tsx`
- `app/community.tsx`
- `app/community/thread/[id].tsx`
- `ARTWORK_HISTORY.md`
- `ARTWORK_HISTORY.txt`

## Beim naechsten Start in Cursor
1. Ordner `C:\Users\indip\tarot-app` oeffnen.
2. Diese Datei lesen.
3. Im Chat schreiben:
   `Bitte lies PROJECT_NOTES.md und mach genau hier weiter.`

## Offene/naechste sinnvolle Aufgaben
- Safety-Hinweis ggf. auch in i18n-Keys auslagern (statt hardcoded Text).
- Optional: kleines Moderations-Review fuer `reports`-Eintraege definieren (Prozess/Policy).
- Optional: Smoke-Test-Checkliste fuer Community-Flow dokumentieren.
