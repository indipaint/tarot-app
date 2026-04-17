# Live Chat Coach Setup (Firebase + OpenAI)

## 1) Firebase CLI vorbereiten

```bash
npm i -g firebase-tools
firebase login
firebase use endyia-tarot
```

## 2) Functions-Abhaengigkeiten installieren

```bash
cd functions
npm install
cd ..
```

## 3) Secret fuer OpenAI API Key setzen

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

Optionales Model (Default ist `gpt-4o-mini`):
In `functions/index.js` kannst du bei Bedarf die Variable `model` aendern.

## 4) Function deployen

```bash
firebase deploy --only functions
```

Danach bekommst du eine URL in der Form:

`https://europe-west1-endyia-tarot.cloudfunctions.net/coachChat`

## 5) App-URL setzen

In deiner lokalen `.env` Datei:

```env
EXPO_PUBLIC_COACH_API_URL=https://europe-west1-endyia-tarot.cloudfunctions.net/coachChat
```

Dann Expo neu starten (`npm run start`), damit die env-Variable greift.

---

## Request/Response Format

Die App sendet an `EXPO_PUBLIC_COACH_API_URL`:

```json
{
  "locale": "de",
  "entry": {
    "id": "123",
    "cardTitle": "Der Narr",
    "question": "...",
    "note": "..."
  },
  "history": [
    { "role": "user", "text": "..." },
    { "role": "assistant", "text": "..." }
  ],
  "message": "Meine neue Frage..."
}
```

Die Function antwortet mit:

```json
{ "reply": "..." }
```
