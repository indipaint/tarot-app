export const MEANINGS = [
  { id: 1, general: `DER NARR
Psychologisch steht der Narr für den Anfang aller Wege –
für den Moment, in dem etwas Neues ruft, ohne dass der Ausgang bereits bekannt ist.
Psychologisch symbolisiert er den Mut, dem inneren Impuls zu folgen, auch wenn 
noch kein Plan existiert. Er verkörpert Spontaneität, Offenheit und Vertrauen in 
das Leben. Der Narr denkt nicht in Grenzen oder Sicherheiten – er folgt seiner 
inneren Stimme. Oft erscheint diese Karte, wenn ein neuer Lebensabschnitt beginnt 
oder wenn es darum geht, alte Muster loszulassen, um Raum für Wachstum zu schaffen.
 Der Narr erinnert daran, dass Entwicklung nicht immer aus Kontrolle entsteht, 
 sondern aus der Bereitschaft, sich dem Unbekannten zu öffnen.

 Spirituell steht der Narr für den reinen Seelenzustand vor jeder Erfahrung. Er ist 
frei von Erwartungen, frei von Angst, frei von Vergangenheit. Er vertraut dem 
Leben vollständig – nicht aus Naivität, sondern aus tiefer Verbundenheit mit dem 
Fluss des Lebens. Der Abgrund vor ihm ist kein Abgrund, sondern ein Übergang. 
Die Blume in seiner Hand steht für Unschuld und Vertrauen, der kleine weiße Hund 
für die begleitende Intuition, die ihn führt. Der Narr weiß: Jeder Schritt ist 
Teil eines größeren Plans, auch wenn er ihn noch nicht erkennt.

Essenz der Karte
„Ich vertraue dem Leben und gehe meinen Weg mit offenem Herzen.“
„Ich darf neu beginnen, ohne Angst vor dem Unbekannten.“„In mir lebt der Mut, meinem inneren Ruf zu folgen.“`},
];

export function getMeaningById(id: string | number) {
  const key = String(id).replace(/^0+/, "");
  return MEANINGS.find(
    (m) => String(m.id).replace(/^0+/, "") === key
  );
}
