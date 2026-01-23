export const MEANINGS = [
  { id: 0, general: `DER NARR

Psychologisch steht der Narr für den Anfang aller Wege –
für den Moment, in dem etwas Neues ruft, ohne dass der Ausgang bereits bekannt ist.
Psychologisch symbolisiert er den Mut, dem inneren Impuls zu folgen, auch wenn noch …
Spirituell steht der Narr für den reinen Seelenzustand vor jeder Erfahrung. Er ist …
Essenz der Karte

„Ich vertraue dem Leben und gehe meinen Weg mit offenem Herzen.“
„Ich darf neu beginnen, ohne Angst vor dem Unbekannten.“
„In mir lebt der Mut, meinem inneren Ruf zu folgen.“`},
];

export function getMeaningById(id: string | number) {
  return MEANINGS.find((m) => String(m.id) === String(id));
}
