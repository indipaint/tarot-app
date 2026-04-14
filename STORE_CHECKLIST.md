# Store-Release-Checkliste (ENDYIA Tarot)

Diese Datei liegt nur im Repository und wird **nicht** in die gebaute App eingebunden.

## Rechtliches & Store-Pflichten

- [ ] **Datenschutzerklärung** als öffentliche Webseite (HTTPS), inhaltlich auf deine App abgestimmt (Firebase, UGC, Chat, Geräte-ID/Nickname, Reports).
- [ ] **Nutzungsbedingungen** (empfohlen bei Community/Chat/UGC), ebenfalls HTTPS.
- [ ] In `src/legal.ts` die Platzhalter-URLs durch deine echten URLs ersetzen.
- [ ] Texte in der App sind **kein Ersatz** für eine vollständige Policy – die muss extern erreichbar sein.
- [ ] Für finale Formulierungen idealerweise **Rechtsberatung** (DE/EU: DSGVO, Jugendschutz, UGC).

## App Store (Apple) / Play Store (Google)

- [ ] Datenschutz-URL in den Store-Einträgen hinterlegen.
- [ ] Altersfreigabe / UGC / Chat korrekt angeben (User-Generated Content, Messaging).
- [ ] Kontakt für Meldungen/Support (E-Mail oder Formular) in den Stores bzw. in der App erreichbar.
- [ ] Screenshots und Beschreibung spiegeln die echten Funktionen (Community, private Chats).

## Technik (Firebase / Sicherheit)

- [ ] **Firestore Security Rules** schreiben und deployen – aktuell ist Client-seitige Logik **kein** Schutz vor Datenmissbrauch.
  - `posts`: lesen nach Regeln; schreiben nur mit gültigen Feldern; löschen nur Autor.
  - `threads` / `threads/{id}/messages`: nur `userA`/`userB` lesen/schreiben; keine öffentliche Lesbarkeit.
  - `reports`: nur authentifizierte oder eingeschränkte Schreibrechte; Lesen nur Admin/Backend.
- [ ] Optional: **Firebase Authentication** statt nur `community_uid` in AsyncStorage (stärkere Identität, bessere Rules).
- [ ] **Blockliste** (`blocked_uids` in AsyncStorage) ist nur lokal – für echtes „Blockieren serverseitig“ bräuchte es Regeln + Nutzerprofil in Firestore.

## Funktionen, die du bereits hast (kurz testen)

- [ ] Erstes Öffnen Community: Datenschutz-Zustimmung erscheint, danach Nickname/Feed.
- [ ] Privater Thread nur für die beiden Teilnehmer (nach Rules-Deployment verifizieren).
- [ ] Melden / Blockieren im privaten Chat (UI vorhanden – Backend/Moderation-Prozess definieren).

## Vor dem Einreichen

- [ ] Release-Build testen (nicht nur Expo Go).
- [ ] Policy-Links in der App antippen → Seite lädt im Browser.
- [ ] Crashlytics/Analytics: falls aktiv, in der Privacy Policy erwähnen und ggf. Einwilligung.
