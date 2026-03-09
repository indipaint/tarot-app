export type Depth = "sanft" | "tief" | "existenziell";

export const QUESTIONS: Record<
  string,
  {
    sanft: Record<string, string[]>;
    tief: Record<string, string[]>;
    existenziell: Record<string, string[]>;
  }
> = {

  // ─────────────────────────────────────────
  // GROSSE ARKANA
  // ─────────────────────────────────────────

   "00": { // Der Narr
    sanft: { de: [
      "Wo darf ich heute einen kleinen Schritt ins Unbekannte wagen?",
      "Was würde ich tun, wenn ich nichts zu verlieren hätte?",
      "Wo kann meine Neugier stärker sein als meine Sicherheit?",
      "Was in mir möchte einfach ausprobieren, ohne alles zu verstehen?",
      "Wo ruft mich gerade etwas Neues – obwohl ich den Ausgang noch nicht kenne?"
    ]},
    tief: { de: [
      "Wo halte ich mich zurück, obwohl ein innerer Impuls mich ruft?",
      "Welche Angst vor Fehlern verhindert meinen nächsten Schritt?",
      "Welche alten Gewohnheiten darf ich loslassen, damit in mir mehr Freiheit entsteht?",
      "Was könnte ich alles tun, wenn ich dem Leben vertraue?",
      "Was würde ich riskieren, wenn Scheitern keine Rolle spielte?"
    ]},
    existenziell: { de: [
      "Wo beginne ich einen neuen Weg, auch wenn ich nicht weiß wohin er führt?",
      "Wer bin ich, wenn ich mich nicht über meine Vergangenheit definiere?",
      "Bin ich bereit, mich dem Leben ohne Garantie zu öffnen?"
    ]}
  },

  "01": { // Der Magier
    sanft: { de: [
      "Wo kann ich heute bewusst eine kleine Handlung durchführen?",
      "Welche Fähigkeit in mir möchte gerade genutzt werden?",
      "Gibt es eine Kraft in mir, die ich unterschätze?",
      "Wo kann ich meine Aufmerksamkeit, Ziele und Bedürfnisse klar ausrichten?"
    ]},
    tief: { de: [
      "Wo kann ich meine eigene Gestaltungskraft noch besser einsetzen?",
      "Welche Idee in mir darf umgesetzt werden?",
      "Wo spüre ich gerade: Ich kann gestalten – und ich darf anfangen?"
    ]},
    existenziell: { de: [
      "Was möchte durch mich in dieser Welt Gestalt annehmen?",
      "Wer wäre ich ohne das Gefühl machtlos zu sein?",
      "Mit welchen Gedanken bin ich bereit, meine Wirklichkeit bewusst zu erschaffen?",
      "Sage und lebe ich das, was ich sagen und leben will?",
      "Gibt es eine Wahrheit, die ich aussprechen möchte?",
      "Bin ich bereit, das entgegenzunehmen, was aus mir entstehen wird?"
    ]}
  },

  "02": { // Die Hohepriesterin
    sanft: { de: [
      "Wo darf ich heute einfach still werden und lauschen?",
      "Welche leise Ahnung in mir möchte wahrgenommen werden?",
      "Was sagt mir meine Stille gerade?",
      "Wo darf ich innehalten, statt sofort eine Lösung zu erzwingen?",
      "Wo spüre ich eine Wahrheit, auch ohne Beweis?"
    ]},
    tief: { de: [
      "Wie kann ich meine Intuition besser wahrnehmen?",
      "Welche Antwort kenne ich bereits, ohne sie auszusprechen?",
      "Was kann ich ohne Verstehen erkennen?",
      "Wo vertraue ich eher der Logik als meiner inneren Stimme?"
    ]},
    existenziell: { de: [
      "Sagt mir mein Inneres etwas, bevor mein Verstand es versteht?",
      "Bin ich bereit, meinem Nicht-Wissen Raum zu geben?",
      "Welche Wahrheit zeigt sich, wenn ich still werde?",
      "Was würde entstehen, wenn ich aufhöre zu suchen?"
    ]}
  },

  "03": { // Die Herrscherin
    sanft: { de: [
      "Wo darf ich heute mehr empfangen statt leisten?",
      "Was nährt mich gerade wirklich?",
      "Wo kann ich mir selbst gütiger begegnen?",
      "Was blüht gerade in meinem Leben?",
      "Wo darf ich mich um mich selbst kümmern?"
    ]},
    tief: { de: [
      "Wo kann ich Fülle leben?",
      "Wie würde mein Lebensgefühl sein, wenn ich mir mehr Liebe zu mir gestatte?",
      "Was in mir möchte wachsen und gesehen werden?",
      "Wo darf ich mich selbst liebevoll halten?",
      "Wo gebe ich mehr als ich empfange?"
    ]},
    existenziell: { de: [
      "Wo darf ich mich dem Leben ganz öffnen?",
      "Wie ist es für mich, wenn mein Wert nichts mit meiner Leistung zu tun hat?",
      "Wie zeigt sich meine schöpferische Kraft im Alltag?"
    ]}
  },

  "04": { // Der Herrscher
    sanft: { de: [
      "Wo tut mir heute eine klare Struktur gut?",
      "Wo kann ich für Stabilität sorgen?"
    ]},
    tief: { de: [
      "Wo übernehme ich Fürsorge?",
      "Setze ich Grenzen aus Selbstachtung – oder aus Angst, die Kontrolle zu verlieren?",
      "Wie kann ich auf Kontrolle verzichten um mich gelöster zu fühlen?",
      "Welche Grenze schützt meine innere Ordnung?"
    ]},
    existenziell: { de: [
      "Welche Ordnung brauche ich in meinem Leben?",
      "Welche innere Ordnung trägt mich wirklich – und welche habe ich nur übernommen?",
      "Wofür will ich in Erinnerung bleiben?",
      "Woran erkenne ich, dass ich selbstermächtigt lebe?"
    ]}
  },

  "05": { // Der Hohepriester
    sanft: { de: [
      "Welche Werte tragen mich gerade?",
      "Wo suche ich Orientierung?",
      "Welche Werte geben mir Halt, wenn im Außen alles schwankt?"
    ]},
    tief: { de: [
      "Wo folge ich Regeln, die nicht mehr zu mir gehören?",
      "Wo engt mich Tradition ein?",
      "Wo folge ich Erwartungen, obwohl meine innere Stimme etwas anderes weiß?",
      "Welche Weisheit habe ich durch Erfahrung gewonnen?"
    ]},
    existenziell: { de: [
      "Welche Wahrheit lebt in mir, unabhängig von Meinungen und Ansichten?",
      "Was ist heilig für mich – wirklich heilig?",
      "Woran glaube ich wirklich, wenn ich niemandem etwas beweisen muss?",
      "Was glaube ich, weil man es mir gesagt hat?",
      "Wo werde ich zum Lehrer meines eigenen Lebens?",
      "Welche innere Ordnung führt mich?"
    ]}
  },

  "06": { // Die Liebenden
    sanft: { de: [
      "Wo spüre ich heute echte Verbindung?",
      "Welche Verbindung nährt mich?",
      "Wo darf ich mein Herz offen halten?",
      "Was liebe ich gerade in meinem Leben?"
    ]},
    tief: { de: [
      "Wo wähle ich aus Angst statt aus Liebe?",
      "Welche Beziehung spiegelt mir mein Inneres?",
      "Wie liebe ich: aus Wahrheit – oder aus Angst, Mangel oder Gewohnheit?"
    ]},
    existenziell: { de: [
      "Welche Freiheit in mir wird möglich, wenn ich nicht frage 'was bekomme ich', sondern 'was kann ich geben'?",
      "Wie möchte ich lieben – mich selbst und andere?",
      "Welche Wahl entspricht meiner tiefsten Wahrheit?",
      "Was wäre, wenn ich mich selbst so liebte wie jemand anderen?",
      "Ist irgendein Mensch es wert, dass ich meinen inneren Frieden verliere?"
    ]}
  },

  "07": { // Der Wagen
    sanft: { de: [
      "Wo bewege ich mich gerade vorwärts?",
      "Was gibt mir inneren Antrieb?",
      "Was treibt mich gerade voran?",
      "Wogegen kämpfe ich, das ich gar nicht kämpfen müsste?"
    ]},
    tief: { de: [
      "Welche gegensätzlichen Kräfte wirken in mir?",
      "Wo brauche ich mehr innere Führung?",
      "Wenn ich zentriert bleibe: Wohin würde ich mein Leben jetzt lenken, auch wenn es Mut braucht?"
    ]},
    existenziell: { de: [
      "Welche Kraft trägt mich durch Widerstände?",
      "Wie fühle ich mich, wenn ich niemanden beeindrucken muss?",
      "Was bedeutet es für mich, meinen Weg bewusst zu lenken?"
    ]}
  },

  "08": { // Die Kraft
    sanft: { de: [
      "Wo darf ich heute geduldiger mit mir sein?",
      "Welcher Anteil in mir will nicht bekämpft, sondern gehalten werden?",
      "Wo in mir spüre ich Kraft?",
      "Wo erlebe ich meine sanfte Stärke?",
      "Wo kann ich mich an meiner Kraft erfreuen?"
    ]},
    tief: { de: [
      "Wo darf ich meine Sinnlichkeit leben?",
      "Wo werde ich hart, obwohl ich eigentlich Nähe brauche – zu mir oder zu jemandem?",
      "Was in mir will ich zähmen – und warum?",
      "Wo entsteht Stärke durch Sanftheit?",
      "Die tiefste Form von Mut für mich ist …?",
      "Welche innere Kraft entdecke ich gerade?"
    ]},
    existenziell: { de: [
      "Was bedeutet wahre Stärke für mich?",
      "Wie kann ich mich mit meiner Kraft verbinden?",
      "Wenn wahre Stärke leise ist: Wo darf Liebe stärker sein als Durchsetzung?",
      "Wer bin ich, wenn ich meine sinnliche Natur wirklich annehme?",
      "Was würde ich tun, wenn ich wüsste, dass ich stark genug bin?"
    ]}
  },

  "09": { // Der Eremit
    sanft: { de: [
      "Wo tut mir heute ein Moment der Stille gut?",
      "Was entdecke ich, wenn ich nach innen schaue?",
      "Wo brauche ich Rückzug, um mich wieder zu hören?",
      "Wo brauche ich weniger äußere Stimmen?",
      "In der Stille liegt für mich Kraft weil …"
    ]},
    tief: { de: [
      "Welche Wahrheit zeigt sich, wenn ich allein bin?",
      "Wie darf ich mich vom Lärm der Welt lösen?",
      "Welche Erkenntnis wächst gerade in mir?",
      "Was leuchtet in mir, auch wenn niemand zuschaut?",
      "Wovor ziehe ich mich zurück?"
    ]},
    existenziell: { de: [
      "Welches Licht trage ich selbst in mir?",
      "Wohin führt mich mein innerer Kompass?",
      "Wie ist es, wenn ich mir wirklich zuhöre?",
      "Wen treffe ich, wenn ich alle Rollen ablege?",
      "Was finde ich, wenn ich wirklich allein bin?"
    ]}
  },

  "10": { // Rad des Schicksals
    sanft: { de: [
      "Welche Veränderung zeigt sich gerade in meinem Leben?",
      "Wo darf ich mit dem Fluss gehen?",
      "Was wandelt sich gerade ganz natürlich?"
    ]},
    tief: { de: [
      "Wo halte ich fest, obwohl Veränderung ruft?",
      "Welche Lektion wiederholt sich in meinem Leben?",
      "Wie gehe ich mit dem Unkontrollierbaren um?"
    ]},
    existenziell: { de: [
      "Was möchte das Leben gerade durch mich verändern?",
      "Wie vertraue ich dem Rhythmus meines Weges?",
      "Was bedeutet Wandel für meine Entwicklung?"
    ]}
  },

  "11": { // Die Gerechtigkeit
    sanft: { de: [
      "Wie darf ich heute ehrlich zu mir sein?",
      "Was braucht es für innere Ausgewogenheit?",
      "Wo suche ich Klarheit?",
      "Was braucht gerade Klarheit statt Vermeidung?"
    ]},
    tief: { de: [
      "Welche Handlung entspricht wirklich meinen Werten?",
      "Wo muss ich gerade eine Entscheidung treffen und wie fühlt sie sich fair an?",
      "Welche Entscheidung verlangt nach Aufrichtigkeit?"
    ]},
    existenziell: { de: [
      "Wie bringe ich Herz und Verstand in Balance?",
      "Was bedeutet Wahrheit für mein Leben?"
    ]}
  },

  "12": { // Der Gehängte
    sanft: { de: [
      "Wo darf ich heute einfach innehalten?",
      "Was darf ich heute loslassen?",
      "Welche Situation möchte ich aus einer neuen Perspektive sehen?",
      "Wo hilft mir Geduld?",
      "Wo hilft es, innezuhalten statt zu handeln?"
    ]},
    tief: { de: [
      "Wo halte ich an einer alten Sichtweise fest?",
      "Was halte ich fest, das mich aufhängt?",
      "Was verändert sich, wenn ich nachgebe?",
      "Wo opfere ich mich – und für wen?",
      "Was versuche ich zu kontrollieren, obwohl ich spüre, dass Loslassen mir mehr Frieden geben würde?",
      "Welche Erkenntnis entsteht im Innehalten?"
    ]},
    existenziell: { de: [
      "Was zeigt sich mir, wenn ich Kontrolle aufgebe?",
      "Was muss sterben, damit etwas Neues entstehen kann?",
      "Wie verändert sich mein Blick auf das Leben, wenn ich die andere Seite verstehe?",
      "Was wäre, wenn Stillstand die tiefste Bewegung ist?"
    ]}
  },

  "13": { // Der Tod
    sanft: { de: [
      "Was darf ich heute verabschieden?",
      "Wo endet etwas ganz natürlich?",
      "Was möchte sich wandeln?",
      "Welcher Abschluss bringt mir Erleichterung?",
      "Was halte ich am Leben, obwohl es längst vorbei ist?"
    ]},
    tief: { de: [
      "Welche alte Identität passt nicht mehr zu mir?",
      "Wo halte ich am Vergangenen fest?",
      "Was in meinem Leben ist dabei zu enden – damit etwas Neues Platz hat?",
      "Woran halte ich mich fest, obwohl ich innerlich längst weiß: Es darf gehen?",
      "Wenn ich dem Wandel vertraue: Wer werde ich, wenn ich das Alte wirklich loslasse?"
    ]},
    existenziell: { de: [
      "Welche Veränderung ruft mich gerade?",
      "Wer bin ich jenseits meiner alten Formen?",
      "Was müsste vorbei gehen, damit ich mich wieder freier fühle?",
      "Was bedeutet Vergänglichkeit für mein Leben – und was ist das Positive daran?",
      "Was bleibt von mir, wenn alles andere geht?"
    ]}
  },

  "14": { // Die Mäßigkeit
    sanft: { de: [
      "Wie finde ich heute mein inneres Gleichgewicht?",
      "Was bringt Ruhe in mein System?",
      "Wo finde ich heute meine Balance?",
      "Wo darf ich mir Zeit lassen?",
      "Welche kleine Harmonie kann ich schaffen?"
    ]},
    tief: { de: [
      "Welche Gegensätze möchten sich in mir verbinden?",
      "Wo gerate ich aus dem Maß?",
      "Wo brauche ich weniger Extrem – und mehr gutes Maß?",
      "Was bedeutet innerer Frieden für mich?",
      "Wie kann ich mich selbst wieder ausgleichen?"
    ]},
    existenziell: { de: [
      "Was bedeutet Balance für mein Leben?",
      "Welche zwei Anteile in mir wollen versöhnt werden, statt gegeneinander zu kämpfen?",
      "Was entsteht, wenn meine Gegensätze sich berühren?"
    ]}
  },

  "15": { // Der Teufel
    sanft: { de: [
      "Wo fühle ich mich gebunden – und was daran ist mir vertraut, auch wenn es mich eng macht?",
      "Welche unangenehme Gewohnheit prägt bisher mein Verhalten?",
      "Wo spüre ich innere Abhängigkeit?",
      "Was fühlt sich vertraut, aber nicht frei an?"
    ]},
    tief: { de: [
      "Welche Bindung halte ich selbst aufrecht?",
      "Womit beruhige oder betäube ich mich, statt wirklich zu fühlen, was sich in mir bewegt?",
      "Wo verliere ich meine Freiheit aus Angst?",
      "Welche Schattenseite möchte ich erkennen?",
      "Welchen Schatten in mir darf ich mir anschauen?"
    ]},
    existenziell: { de: [
      "Was bedeutet Freiheit für mich wirklich?",
      "Wenn ich erkenne, dass ich nicht meine Abhängigkeiten bin – wer wäre dann frei?",
      "Wo beginne ich, meine Fesseln zu erkennen?",
      "Wie integriere ich meine Schatten?"
    ]}
  },

  "16": { // Der Turm
    sanft: { de: [
      "Gibt es eine Erkenntnis, die mich gerade überrascht?",
      "Bricht etwas in mir gerade zusammen – und macht vielleicht Platz?",
      "Verändert sich gerade mein Blick auf etwas?",
      "Wo in meinem Leben stimmt etwas nicht mehr – auch wenn es nach außen noch funktioniert?",
      "Bricht gerade etwas auf natürliche Weise auf?"
    ]},
    tief: { de: [
      "Welche Überzeugung verliert gerade ihre Wahrheit?",
      "Welche Wahrheit habe ich zu lange übersehen, bis sie nicht mehr leise bleiben kann?",
      "Darf ich eine Illusion loslassen?",
      "Was hat sich verändert, das ich noch nicht akzeptiert habe?"
    ]},
    existenziell: { de: [
      "Welche Wahrheit befreit mich gerade?",
      "Was entsteht, wenn alte Strukturen zerfallen?",
      "Wenn das, was fällt, nicht mein Wesen ist: Was in mir bleibt wahr, wenn alles Unstimmige zusammenbricht?",
      "Was in meinem Leben darf weniger werden, um mehr Platz für mich zu schaffen?"
    ]}
  },

  "17": { // Der Stern
    sanft: { de: [
      "Wo spüre ich gerade Hoffnung?",
      "Wofür kann ich heute dankbar sein?",
      "Was heilt in mir langsam?",
      "Wo darf ich mir selbst vertrauen?"
    ]},
    tief: { de: [
      "Gibt es eine Verletzung in mir, die gesehen werden möchte?",
      "Wo beginne ich, mir selbst zu vergeben?",
      "Was nährt meine innere Heilung?",
      "Was in mir braucht gerade keine Lösung, sondern Annahme?"
    ]},
    existenziell: { de: [
      "Wann habe ich mich zuletzt ehrlich mit mir selbst versöhnt?",
      "Was bedeutet Vertrauen in mich selbst?",
      "Worauf vertraue ich, auch wenn ich es nicht sehe?"
    ]}
  },

  "18": { // Der Mond
    sanft: { de: [
      "Welche Gefühle bewegen mich gerade?",
      "Was fühle ich, traue mich aber nicht ganz auszusprechen?"
    ]},
    tief: { de: [
      "Was ist gerade unklar – und darf es sein?",
      "Welche Angst möchte erkannt werden?",
      "Welche inneren Bilder sprechen zu mir?",
      "Wo mache ich mir etwas vor, auch durch äußere Einflüsse oder Meinungen?"
    ]},
    existenziell: { de: [
      "Was zeigt mir meine Seele durch Träume und Gefühle?",
      "Bin ich bereit, meinen inneren Schatten zu begegnen?"
    ]}
  },

  "19": { // Die Sonne
    sanft: { de: [
      "Was bringt heute Licht in mein Leben?",
      "Wo spüre ich Freude ohne Grund?",
      "Was darf ich einfach genießen?",
      "Wann fühle ich mich wirklich unverstellt – einfach ich?",
      "Wofür brenne ich wirklich?"
    ]},
    tief: { de: [
      "Wo darf mein inneres Kind sichtbar werden?",
      "Was bringt mein inneres Kind heute noch zum Leuchten?",
      "Welche Wahrheit darf ins Licht treten?",
      "Wo fühle ich mich lebendig?",
      "Erlaube ich mir, meine Freude zu zeigen?"
    ]},
    existenziell: { de: [
      "Was bedeutet echte Lebensfreude für mich?",
      "Wo darf ich aufhören, mich zu erklären – und einfach sein?",
      "Was bedeutet Lebensfreude für mich – jenseits aller Umstände?",
      "Wo erkenne ich, dass ich eigentlich Freude bin?",
      "Wie kann ich meine Freude mit der Welt teilen?"
    ]}
  },

  "20": { // Das Gericht
    sanft: { de: [
      "Was ruft mich gerade innerlich?",
      "Entsteht in mir gerade eine neue Erkenntnis?",
      "Was in meinem Leben ruft nach einer ehrlichen Entscheidung?"
    ]},
    tief: { de: [
      "Welche Vergangenheit möchte ich loslassen?",
      "Welche alte Identität bin ich bereit hinter mir zu lassen?",
      "Wo darf ich mir selbst vergeben?",
      "Was will neu gelebt werden?",
      "Wo urteile ich über mich selbst zu hart?"
    ]},
    existenziell: { de: [
      "Wer bin ich jenseits meiner alten Geschichte?",
      "Bin ich bereit, meinem inneren Ruf zu folgen?",
      "Wofür möchte ich vergeben – um frei weiterzugehen?",
      "Wenn ich mein Leben neu gestalten könnte – was würde bleiben?"
    ]}
  },

  "21": { // Die Welt
    sanft: { de: [
      "Wobei fühle ich mich ganz?",
      "Was habe ich bereits erreicht?",
      "Wo darf ich meinen Weg würdigen?",
      "Wie könnte ich Frieden mit mir schließen – und was könnte mich dorthin führen?",
      "Was darf heute gefeiert werden?"
    ]},
    tief: { de: [
      "Welche Erfahrung hat mich vollständiger gemacht?",
      "Was fühlt sich für mich gerade vollendet an – auch wenn es kein offizielles Ende hat?",
      "Wie erkenne ich meinen inneren Frieden?",
      "Was integriert sich gerade in meinem Leben?"
    ]},
    existenziell: { de: [
      "Was bedeutet Echtsein für mich?",
      "Wie zeigt sich mein Platz im größeren Ganzen?",
      "Wobei empfinde ich Einheit mit dem Leben?",
      "Wenn ich nichts mehr plausibel machen müsste – wie frei wäre ich dann?",
      "Was bedeutet Vollständigkeit für mich?",
      "Was wäre, wenn ich bereits alles bin, was ich sein muss?"
    ]}
  },
"W01": { // Ass der Stäbe
  sanft: { de: [
    "Was macht mich im Moment neugierig?",
    "Welche Idee möchte ich heute einfach ausprobieren?",
    "Wo darf ich meiner spontanen Energie folgen?",
    "Welcher Neuanfang klopft gerade an?",
    "Was möchte in mir gerade entstehen?",
    "Welche neue Möglichkeit zeigt sich leise?",
    "Wo spüre ich Lust, etwas zu beginnen?"
  ]},
  tief: { de: [
    "Welche neue Kraft beginnt gerade in mir zu wachsen?",
    "Was möchte ich wirklich in Bewegung bringen?",
    "Welche Vision berührt mich stärker, als ich dachte?",
    "Wo halte ich meinen eigenen Impuls noch zurück?",
    "Welche Idee verdient es, ernst genommen zu werden?",
    "Was würde entstehen, wenn ich meinem Inneren vertraue?"
  ]},
  existenziell: { de: [
    "Wofür bin ich bereit, meine ganze Lebenskraft einzusetzen?",
    "Welche Vision möchte durch mein Leben Wirklichkeit werden?",
    "Was beginnt, wenn ich meinem inneren Ruf folge?",
    "Wo ruft mich mein eigenes Feuer?",
    "Was würde ich erschaffen, wenn ich mutig beginne?",
    "Welche Spur möchte ich mit meiner Energie hinterlassen?",
    "Welches neue Kapitel meines Lebens möchte entstehen?"
  ]}
},

"W02": { // Zwei der Stäbe
  sanft: { de: [
    "Wo öffnet sich für mich gerade ein neuer Blick auf Möglichkeiten?",
    "Was planst du – mit Freude statt Druck?",
    "Was hält dich in der Vertrautheit gefangen?",
    "Wo darf ich mir erlauben, größer zu denken?",
    "Welche Vision hast du aufgegeben?"
  ]},
  tief: { de: [
    "Was könnte wachsen, wenn ich meinen Horizont erweitere?",
    "Wo stehe ich zwischen Sicherheit und Abenteuer?",
    "Welche Möglichkeit habe ich bisher unterschätzt?",
    "Was ruft mich, obwohl ich noch zögere?",
    "Welche Zukunft beginne ich mir vorzustellen?"
  ]},
  existenziell: { de: [
    "Welche Richtung meines Lebens möchte ich wirklich einschlagen?",
    "Was wäre möglich, wenn ich meine Angst vor meiner Größe loslasse?",
    "Wo darf ich über meine bisherigen Grenzen hinausdenken?",
    "Welche Entscheidung könnte mein Leben verändern?",
    "Wohin möchte ich meine Lebensreise führen?",
    "Wohin würdest du gehen, wenn alles möglich wäre?"
  ]}
},

"W03": { // Drei der Stäbe
  sanft: { de: [
    "Wo darf ich heute auf das vertrauen, was ich begonnen habe?",
    "Was entwickelt sich gerade langsam weiter?",
    "Wo zeigt sich ein erster Ausblick auf das, was kommen kann?",
    "Was habe ich angestoßen, das nun wachsen darf?",
    "Welche Entwicklung beginnt sich abzuzeichnen?"
  ]},
  tief: { de: [
    "Welche meiner Entscheidungen trägt bereits erste kleine Früchte?",
    "Wo lohnt es sich, Vertrauen in meinen Weg zu haben?",
    "Was entsteht gerade aus meinem früheren Mut?",
    "Wo darf ich dem Prozess des Wachsens Zeit geben?",
    "Welche Vision beginnt Wirklichkeit zu werden?",
    "Was sendest du aus – und was erwartest du zurück?",
    "Was wächst, auch wenn ich es noch nicht vollständig sehe?"
  ]},
  existenziell: { de: [
    "Welcher Weg meines Lebens entfaltet sich gerade?",
    "Was habe ich begonnen, das größer wird als ich dachte?",
    "Wo darf ich dem Fluss meines Lebens vertrauen?",
    "Was zeigt mir, dass mein Weg Sinn hat?",
    "Welche Vision beginnt Realität zu werden?",
    "Was müsstest du loslassen, damit etwas zurückkommen kann?",
    "Was hinterlässt du in der Welt?"
  ]}
},

"W04": { // Vier der Stäbe
  sanft: { de: [
    "Wo darf ich heute einen Moment der Freude zulassen?",
    "Was fühlt sich für mich gerade stabil und gut an?",
    "Wo spüre ich ein Gefühl von Zuhause?",
    "Was möchte ich heute bewusst feiern?",
    "Wo erlebe ich Gemeinschaft oder Unterstützung?",
    "Was gibt mir im Moment Halt?",
    "Welche kleine Freude darf ich würdigen?"
  ]},
  tief: { de: [
    "Wo suchst du Zugehörigkeit, die du dir selbst geben könntest?",
    "Wo in meinem Leben ist ein Fundament entstanden?",
    "Welche Verbindung gibt mir echte Stärke?",
    "Was habe ich aufgebaut, das mich trägt?",
    "Welche Beziehung schenkt mir Vertrauen?",
    "Wo darf ich Dankbarkeit spüren?"
  ]},
  existenziell: { de: [
    "Was wäre, wenn du dein eigenes Zuhause wärst?",
    "Welche Form von Gemeinschaft trägt mein Leben wirklich?",
    "Wo finde ich echten inneren Halt?",
    "Was bedeutet Heimat für dich – jenseits von Orten?",
    "Was bedeutet für mich ein erfülltes Zuhause?",
    "Welche Beziehungen geben meinem Leben Sinn?",
    "Was habe ich aufgebaut, das bleibt?",
    "Was erfüllt mein Herz mit echter Zugehörigkeit?"
  ]}
},

"W05": { // Fünf der Stäbe
  sanft: { de: [
    "Wo begegnen sich gerade unterschiedliche Energien in meinem Leben?",
    "Wo kannst du heute einen Konflikt sanft ansprechen?",
    "Welche gegenteiligen Welten um mich herum wollen gehört werden?",
    "Wo entsteht lebendige Bewegung durch Unterschiedlichkeit?",
    "Was lerne ich gerade durch Reibung mit anderen?",
    "Wo darf ich spielerischer mit Wettbewerb umgehen?",
    "Welche Herausforderung bringt Bewegung in mein Leben?",
    "Wo entsteht Entwicklung durch Austausch?"
  ]},
  tief: { de: [
    "Welche inneren Stimmen stehen miteinander im Dialog?",
    "Was fordert mich heraus, meine eigene Position zu finden?",
    "Wo lerne ich, mich klarer zu zeigen?",
    "Was braucht Klärung statt Vermeidung?",
    "Welche Spannung hilft mir zu wachsen?",
    "Wo darf ich lernen, mit Unterschiedlichkeit umzugehen?"
  ]},
  existenziell: { de: [
    "Wofür möchtest du gesehen werden?",
    "Was fordert mich heraus, wirklich zu mir zu stehen?",
    "Wo lerne ich, meine eigene Kraft zu behaupten?",
    "Was zeigt mir, wofür ich wirklich kämpfen will?",
    "Wo entsteht aus Konflikt eine neue Stärke?",
    "Was kostet dich dein innerer Widerstand?"
  ]}
},

"W06": { // Sechs der Stäbe
  sanft: { de: [
    "Was darf ich heute an mir anerkennen?",
    "Was ist mir in letzter Zeit gelungen?",
    "Welche Unterstützung habe ich erfahren?",
    "Wo durfte ich über mich hinauswachsen?"
  ]},
  tief: { de: [
    "Welche Entwicklung verdanke ich meinem Durchhaltevermögen?",
    "Wo darf ich mir erlauben, gesehen zu werden?",
    "Was habe ich erreicht, das mir vorher unmöglich schien?"
  ]},
  existenziell: { de: [
    "Welche Form von Anerkennung erfüllt mein Herz wirklich?",
    "Was bedeutet es für mich, meinen eigenen Weg zu gehen?",
    "Was in meinem Leben verdient wirklich Würdigung?",
    "Wie möchte ich meine Stärke in die Welt bringen?"
  ]}
},

"W07": { // Sieben der Stäbe
  sanft: { de: [
    "Welche Grenze darf ich ruhig und klar setzen?",
    "Welche Situation fordert meine Standhaftigkeit?",
    "Wo darf ich meinen Platz behaupten?",
    "Was stärkt mein Vertrauen in mich selbst?",
    "Wo halte ich meine Position mit Ruhe?"
  ]},
  tief: { de: [
    "Wo zeigt sich mein Mut, mich zu zeigen?",
    "Was gibt mir Kraft, auch gegen Widerstand weiterzugehen?",
    "Wo prüft das Leben meine innere Haltung?",
    "Was stärkt meine Standfestigkeit?",
    "Wo verteidigst du dich, wo du dich öffnen könntest?"
  ]},
  existenziell: { de: [
    "Welche Wahrheit in mir ist nicht verhandelbar?",
    "Wofür bin ich bereit, aufzustehen?",
    "Welche Werte tragen mein Leben?",
    "Wo zeigt sich meine Integrität?"
  ]}
},

"W08": { // Acht der Stäbe
  sanft: { de: [
    "Wo spüre ich gerade Bewegung in meinem Leben?",
    "Was kommt schneller auf mich zu, als ich dachte?",
    "Welche Entwicklung nimmt gerade Fahrt auf?",
    "Wo darf ich dem Fluss des Geschehens vertrauen?",
    "Was bringt frische Energie in meinen Alltag?"
  ]},
  tief: { de: [
    "Wo darf ich dem Tempo des Lebens vertrauen?",
    "Welche Veränderung bewegt mich gerade stark?",
    "Welche Entscheidung könnte jetzt Klarheit bringen?",
    "Wo entsteht Dynamik, die mich vorwärts trägt?",
    "Was will jetzt in Bewegung kommen?",
    "Wohin trägt dich dein Leben gerade – willst du das?"
  ]},
  existenziell: { de: [
    "Welche Veränderung meines Lebens lässt sich nicht mehr aufhalten?",
    "Wo führt mich das Leben schneller voran, als ich erwartet habe?",
    "Was bringt mein Leben in eine neue Richtung?",
    "Was geschieht, wenn ich dem Fluss vertraue?",
    "Wohin trägt mich die Dynamik meines Lebens?"
  ]}
},

"W09": { // Neun der Stäbe
  sanft: { de: [
    "Welches Problem konnte mich stärker machen?",
    "Wo darf ich mich an meine eigene Stärke erinnern?",
    "Welche Erfahrung hat mich wachsen lassen?",
    "Wo lohnt es sich, noch einen Moment durchzuhalten?",
    "Was zeigt mir meine innere Widerstandskraft?",
    "Wo habe ich bereits mehr geschafft, als ich glaubte?",
    "Wie kannst du dich heute schützen, ohne dich zu verschließen?"
  ]},
  tief: { de: [
    "Wo zeigt sich meine innere Ausdauer?",
    "Was hat mich stärker gemacht als zuvor?",
    "Was hat dich so vorsichtig gemacht?",
    "Welche alten Wunden bestimmen noch dein Verhalten?",
    "Wo bist du auf der Hut, wo Vertrauen möglich wäre?",
    "Welche Erfahrung hat mir Weisheit geschenkt?",
    "Was trägt mich auch in schwierigen Zeiten?"
  ]},
  existenziell: { de: [
    "Was bedeutet es für mich, nicht aufzugeben?",
    "Wo zeigt sich meine innere Standhaftigkeit?",
    "Was habe ich gelernt, das mir niemand mehr nehmen kann?",
    "Welche Stärke trägt mein Leben durch jede Herausforderung?"
  ]}
},

"W10": { // Zehn der Stäbe
  sanft: { de: [
    "Wo trage ich im Moment sehr viel?",
    "Welche Aufgabe fühlt sich schwerer an als gedacht?",
    "Was habe ich lange getragen?",
    "Wo könnte ich mir Unterstützung erlauben?",
    "Welche Last ist nicht deine zu tragen?",
    "Wo darfst du um Hilfe bitten?"
  ]},
  tief: { de: [
    "Welche Aufgabe habe ich lange allein getragen?",
    "Wo habe ich vielleicht mehr übernommen, als mir guttut?",
    "Was verlangt gerade meine Ausdauer?",
    "Was trägst du, das du nicht loslassen willst – warum?",
    "Welche Verantwortung hast du übernommen, die nicht dir gehört?",
    "Wo darf ich lernen, Hilfe anzunehmen?",
    "Was möchte ich neu ordnen?"
  ]},
  existenziell: { de: [
    "Welche Last gehört wirklich zu meinem Weg – und welche nicht?",
    "Was zeigt mir meine Grenze über mein Leben?",
    "Was hält dich davon ab, Hilfe anzunehmen?",
    "Was darf ich loslassen, um frei weiterzugehen?",
    "Wo beginnt Erleichterung, wenn ich ehrlich hinschaue?"
  ]}
},

"W11": { // Bube der Stäbe
  sanft: { de: [
    "Welche neue Idee macht mich neugierig?",
    "Wo spüre ich spielerische Energie?",
    "Was möchte ich heute entdecken?",
    "Welche Inspiration berührt mich?",
    "Wo darf ich wieder experimentieren?",
    "Welche Möglichkeit klingt spannend?",
    "Was bringt frische Lebendigkeit in mein Leben?"
  ]},
  tief: { de: [
    "Welche neue Leidenschaft beginnt in mir?",
    "Was möchte ich lernen oder erforschen?",
    "Welche Vision weckt meine Begeisterung?",
    "Was würde passieren, wenn du eine Sache wirklich durchziehst?",
    "Wo zeigt sich meine kreative Energie?",
    "Was möchte ich mutig ausprobieren?",
    "Welche Idee trägt Potenzial in sich?"
  ]},
  existenziell: { de: [
    "Welche neue Lebensrichtung beginnt sich zu zeigen?",
    "Wo möchte ich mich wirklich entfalten?",
    "Welche Leidenschaft könnte mein Leben prägen?",
    "Was möchte ich mutig in die Welt bringen?",
    "Welche Vision berührt mein Herz?",
    "Was möchte ich in diesem Leben entdecken?",
    "Welche Möglichkeit wartet darauf, von mir gelebt zu werden?"
  ]}
},

"W12": { // Ritter der Stäbe
  sanft: { de: [
    "Wo spüre ich gerade Aufbruchsstimmung?",
    "Welche Energie treibt mich voran?",
    "Was weckt meine Abenteuerlust?",
    "Wo darf ich mutiger handeln?",
    "Welche Idee bringt Bewegung in mein Leben?",
    "Was ruft mich nach vorne?",
    "Wo möchte ich etwas wagen?"
  ]},
  tief: { de: [
    "Welche Leidenschaft gibt meinem Leben Richtung?",
    "Wo zeigt sich mein Mut, neue Wege zu gehen?",
    "Was brennt in dir, das keine Richtung hat?",
    "Welche Leidenschaft darf sich zeigen?",
    "Welche Herausforderung reizt mich?"
  ]},
  existenziell: { de: [
    "Welche Leidenschaft gibt meinem Leben Sinn?",
    "Welche Vision fordert meinen ganzen Mut?",
    "Was treibt mich wirklich an?",
    "Welche Richtung fühlt sich lebendig an?",
    "Wofür möchte ich meine ganze Energie einsetzen?"
  ]}
},

"W13": { // Königin der Stäbe
  sanft: { de: [
    "Wo spüre ich Vertrauen in meine eigene Ausstrahlung?",
    "Wo darf ich mich selbstbewusst zeigen?",
    "Welche Qualität in mir wirkt inspirierend?",
    "Was bringt mein inneres Leuchten hervor?",
    "Wo spüre ich Freude an meiner Lebendigkeit?",
    "Welche Seite von mir möchte sichtbar sein?"
  ]},
  tief: { de: [
    "Welche Kraft in mir wirkt auf andere?",
    "Was bedeutet Selbstvertrauen für mich?",
    "Welche Stärke habe ich über die Jahre entwickelt?",
    "Welche Wirkung hat meine Präsenz?",
    "Wo kannst du andere mit deiner Energie inspirieren?",
    "Was liebst du an deiner eigenen Kraft?",
    "Wo zeigst du Stärke, wo du Schwäche zeigen darfst?",
    "Was kostet es dich, immer die Starke zu sein?"
  ]},
  existenziell: { de: [
    "Was wäre, wenn du deine Kraft nicht beweisen müsstest?",
    "Wie möchte ich meine Kraft in die Welt bringen?",
    "Welche Ausstrahlung möchte ich verkörpern?",
    "Was bedeutet es für mich, ganz ich selbst zu sein?",
    "Wo zeigt sich meine wahre Größe?",
    "Wie verberge ich meine eigene Bedürftigkeit?"
  ]}
},

"W14": { // König der Stäbe
  sanft: { de: [
    "Was inspiriert mich, voranzugehen?",
    "Welche Entscheidung fühlt sich kraftvoll an?",
    "Was möchte ich bewusst gestalten?"
  ]},
  tief: { de: [
    "Welche Vision meines Lebens möchte ich führen?",
    "Welche Kraft hilft mir, andere zu inspirieren?",
    "Was bedeutet für mich echte Führung?",
    "Wo darf ich meine Erfahrung einsetzen?"
  ]},
  existenziell: { de: [
    "Wo herrschst du, wo du dienen könntest?",
    "Welche Richtung gebe ich meinem Leben?",
    "Was bedeutet es für mich, mein Leben bewusst zu gestalten?",
    "Setze ich meine Kraft für mich oder für alle ein?"
  ]}
},
  // ─────────────────────────────────────────
  // KELCHE
  // ─────────────────────────────────────────

"C01": { // Ass der Kelche
  sanft: { de: [
    "Wobei öffnet sich mein Herz gerade ganz von selbst?",
    "Was berührt mich im Moment besonders sanft?",
    "Wo spüre ich heute Dankbarkeit?",
    "Welches Gefühl möchte in mir Raum bekommen?",
    "Was tut meinem Herzen heute gut?",
    "Wo erlaube ich mir, weich zu sein?",
    "Was möchte ich heute mit offenem Herzen empfangen?"
  ]},
  tief: { de: [
    "Welches Gefühl möchte in mir wirklich gefühlt werden?",
    "Wie beginne ich, mich innerlich zu öffnen?",
    "Was nährt mein Herz gerade wirklich?",
    "Wo wünsche ich mir mehr Verbundenheit?",
    "Welcher Teil in mir sehnt sich nach Annahme?",
    "Was darf ich heute liebevoll zulassen?",
    "Welche neue Form von Liebe möchte in mir entstehen?"
  ]},
  existenziell: { de: [
    "Was bedeutet es für mich, mit offenem Herzen zu leben?",
    "Welche Quelle in mir nährt mein Leben wirklich?",
    "Was möchte ich empfangen, ohne es festhalten zu wollen?",
    "Wie könnte sich mein Leben verändern, wenn ich mein Herz nicht verschließe?",
    "Welche Form von Verbundenheit trägt mein Leben?",
    "Was fließt in mein Leben, wenn ich innerlich Ja sage?"
  ]}
},

"C02": { // Zwei der Kelche
  sanft: { de: [
    "Wo erlebe ich gerade ehrliche Nähe?",
    "Mit wem fühle ich mich im Herzen verbunden?",
    "Wo darf Begegnung heute leicht sein?",
    "Welche Verbindung tut mir gerade gut?",
    "Wo fühle ich mich wirklich gesehen?",
    "Was entsteht, wenn ich mich ein wenig mehr öffne?",
    "Welche Begegnung trägt Wärme in sich?"
  ]},
  tief: { de: [
    "Wo wünsche ich mir echte Resonanz?",
    "Wie zeige ich mich, wenn mir jemand wichtig ist?",
    "Welche Verbindung in meinem Leben ist heilsam für mich?",
    "Wo halte ich Nähe zurück, obwohl ich sie mir wünsche?",
    "Was bedeutet für mich eine harmonische Beziehung?",
    "Wo darf ich Vertrauen in Verbindung wachsen lassen?",
    "Welche Begegnung berührt mich tiefer, als ich zeige?"
  ]},
  existenziell: { de: [
    "Wie liebe ich, wenn ich nichts beweisen muss?",
    "Welche Verbindung in meinem Leben trägt Wahrheit in sich?",
    "Was heilt in mir durch wahrhaftige Begegnung?",
    "Welche Beziehung spiegelt mir mein eigenes Herz zu mir?",
    "Wie möchte ich Verbundenheit leben?"
  ]}
},

"C03": { // Drei der Kelche
  sanft: { de: [
    "Wo darf ich heute Freude teilen?",
    "Mit wem lache ich von Herzen gern?",
    "Welche Begegnung hebt gerade meine Stimmung?",
    "Wo erlebe ich Leichtigkeit mit anderen?",
    "Was gibt mir das Gefühl, dazuzugehören?",
    "Welche gemeinsame Freude tut mir gut?"
  ]},
  tief: { de: [
    "Wo erlebe ich Gemeinschaft, in der ich mich zeigen kann?",
    "Was bedeutet für mich geteilte Freude?",
    "Welche Verbindung lässt mich aufatmen?",
    "Wo darf ich mich getragen fühlen?",
    "Welche Form von Miteinander wünsche ich mir mehr?"
  ]},
  existenziell: { de: [
    "Welche Gemeinschaft entspricht meinem Wesen?",
    "Wo finde ich Verbundenheit, ohne mich zu verlieren?",
    "Was bedeutet Zugehörigkeit für mich wirklich?",
    "Mit wem teile ich nicht nur Zeit, sondern Leben?"
  ]}
},

"C04": { // Vier der Kelche
  sanft: { de: [
    "Wo bin ich gerade innerlich eher still als offen?",
    "Wo wünsche ich mir mehr Lebendigkeit?",
    "Welches Gefühl zieht sich im Moment eher zurück?",
    "Was spricht mich gerade nicht wirklich an?",
    "Wo brauche ich einen neuen Blick auf das, was da ist?"
  ]},
  tief: { de: [
    "Wo habe ich mich innerlich ein Stück verschlossen?",
    "Was kann ich gerade nicht wirklich annehmen?",
    "Welche Enttäuschung wirkt vielleicht noch in mir nach?",
    "Wo sehne ich mich nach mehr Sinn oder Berührung?",
    "Was übersehe ich, obwohl es mir gut tun könnte?",
    "Wo ist mein Herz müde geworden?"
  ]},
  existenziell: { de: [
    "Welche Form von Lebendigkeit vermisse ich in mir?",
    "Wo bin ich innerlich nicht mehr ganz anwesend?",
    "Was wartet auf mich, wenn ich meine Abgewandtheit löse?",
    "Was bedeutet Dankbarkeit jenseits von Worten?"
  ]}
},

"C05": { // Fünf der Kelche
  sanft: { de: [
    "Wo trauere ich noch um etwas, das mir wichtig war?",
    "Was in mir braucht heute Trost?",
    "Welche Enttäuschung darf ich liebevoll ansehen?",
    "Wo spüre ich Verlust oder Schmerz?",
    "Was hat Verlust dich gelehrt?",
    "Was darf in mir betrauert werden?",
    "Wo wünsche ich mir Mitgefühl – von mir selbst oder anderen?",
    "Was hilft mir, sanft mit Traurigkeit umzugehen?"
  ]},
  tief: { de: [
    "Worüber bin ich noch nicht ganz hinweg?",
    "Welche Verletzung wirkt in mir noch nach?",
    "Was habe ich verloren, das ich innerlich noch halte?",
    "Wo hältst du dich im Schmerz fest?",
    "Wo fällt es mir schwer, das Verbliebene zu sehen?",
    "Welche Traurigkeit verdient ehrlichen Raum?",
    "Was siehst du nicht, weil du auf das Verlorene starrst?",
    "Was wäre, wenn Trauer ein Weg zur Tiefe ist?",
    "Was in mir möchte beweint werden, damit Heilung beginnt?",
    "Wo braucht mein Herz heute Fürsorge?"
  ]},
  existenziell: { de: [
    "Wie gehe ich mit Verlust um, ohne mich darin zu verlieren?",
    "Was bleibt, wenn etwas Wichtiges gegangen ist?",
    "Welche Form von Trauer hat mich als Mensch verändert?",
    "Wo finde ich Sinn, obwohl etwas zerbrochen ist?",
    "Was bleibt noch, auch nach dem Schmerz?",
    "Wie lerne ich, mit offenem Herzen weiterzuleben?",
    "Was zeigt mir der Schmerz über meine Fähigkeit zu lieben?",
    "Was trägt mich, wenn ich Abschied nehmen muss?",
    "Was bleibt von Liebe, wenn sie geht?"
  ]}
},

"C06": { // Sechs der Kelche
  sanft: { de: [
    "Welche Erinnerung wärmt mein Herz heute?",
    "Was lässt mich an Unschuld oder Leichtigkeit denken?",
    "Wo spüre ich eine vertraute Wärme?",
    "Was aus deiner Vergangenheit gibt dir Wärme?",
    "Welche Begegnung erinnert mich an etwas Schönes?",
    "Was verbindet mich mit meiner Vergangenheit auf gute Weise?",
    "Welche alte Freude lebt noch in mir?"
  ]},
  tief: { de: [
    "Welche Erfahrung aus meiner Vergangenheit nährt mich noch heute?",
    "Wünsche ich mir die Unbeschwertheit von früher zurück?",
    "Welche Erfahrung aus meiner Vergangenheit nährt mich noch heute?",
    "Was hält dich in der Vergangenheit gefangen?",
    "Was idealisierst du an früher, das so nie war?",
    "Welche Nostalgie verhindert dein Jetzt?",
    "Welche Beziehung trägt noch immer einen zarten Wert in sich?",
    "Was in mir ist über die Jahre weich geblieben?",
    "Welche Sehnsucht nach Geborgenheit kenne ich gut?",
    "Wo wirkt kindliche Offenheit noch in mir?",
    "Was erinnert mich daran, wer ich einmal ganz natürlich war?"
  ]},
  existenziell: { de: [
    "Welche Teile meiner Geschichte gehören liebevoll zu mir?",
    "Was aus meiner Vergangenheit möchte integriert statt vergessen werden?",
    "Was trägst du aus deiner Kindheit, das noch heilt?",
    "Wo berührt mich mein eigenes inneres Kind heute noch?",
    "Welche Form von Unschuld suche ich vielleicht wieder?",
    "Warst du wirklich jemand anderes, bevor die Welt dich prägte?",
    "Was bleibt von mir, wenn ich mich an mein ursprüngliches Wesen erinnere?",
    "Wie prägt meine Vergangenheit mein heutiges Lieben?"
  ]}
},

"C07": { // Sieben der Kelche
  sanft: { de: [
    "Wo verliere ich mich manchmal in Möglichkeiten?",
    "Was regt meine Fantasie im Moment an?",
    "Welche Vorstellung fühlt sich verlockend an?",
    "Wo brauche ich mehr Klarheit zwischen Wunsch und Wirklichkeit?",
    "Welche Sehnsucht zeigt sich in meinen inneren Bildern?"
  ]},
  tief: { de: [
    "Welche meiner Wünsche sind wirklich meine eigenen?",
    "Wo lenken mich Vorstellungen von dem ab, was gerade da ist?",
    "Welche Sehnsucht trägt Tiefe – und welche eher Flucht?",
    "Wo verwirre ich mich durch zu viele Möglichkeiten?",
    "Welcher Wunsch sagt etwas Wesentliches über mich aus?",
    "Was suche ich im Außen, das vielleicht in mir beginnt?",
    "Wo wünsche ich mir mehr Ehrlichkeit mir mir selbst?"
  ]},
  existenziell: { de: [
    "Wo verwechsle ich Fantasie mit innerer Wahrheit?",
    "Welche Möglichkeit entspricht meinem Wesen am tiefsten?",
    "Wie erkenne ich, was mich wirklich ruft?"
  ]}
},

"C08": { // Acht der Kelche
  sanft: { de: [
    "Wo spüre ich, dass etwas in meinem Leben nicht mehr zu mir passt?",
    "Was darf ich vielleicht hinter mir lassen?",
    "Wo ruft mich etwas weiter als das Vertraute?",
    "Wo spüre ich einen stillen Wunsch nach Aufbruch?",
    "Was könnte ich loslassen, um freier zu werden?",
    "Was hat sich erfüllt – und braucht keinen Abschluss mehr?",
    "Welche Situation fühlt sich innerlich abgeschlossen an?"
  ]},
  tief: { de: [
    "Wo bleibe ich noch, obwohl mein Herz schon weitergezogen ist?",
    "Was halte ich aus Gewohnheit fest?",
    "Welche Form von Abschied möchte in mir reifen?",
    "Wo sehne ich mich nach mehr Tiefe oder Wahrheit?",
    "Was lasse ich zurück, wenn ich mir selbst treu werde?",
    "Welche Leere weist mich vielleicht auf einen neuen Weg hin?",
    "Wo in meinem Körper spüre ich Aufbruch zu etwas Neuem?"
  ]},
  existenziell: { de: [
    "Wovon gehe ich weg, um mir selbst näherzukommen?",
    "Was suchst du jenseits dessen, was du kennst?",
    "Was ist vorbei, auch wenn ich es noch nicht ganz ausgesprochen habe?",
    "Welche innere Reise beginnt, wenn ich dem Ruf meines Herzens folge?",
    "Wo führt mich Sehnsucht tiefer als Bequemlichkeit?",
    "Was wäre, wenn Aufbruch die tiefste Form von Treue zu dir ist?",
    "Was darf enden, damit ich wahrhaftiger lebe?",
    "Wie erkenne ich, wann Bleiben nicht mehr Liebe ist?",
    "Was suche ich jenseits des Vertrauten wirklich?"
  ]}
},

"C09": { // Neun der Kelche
  sanft: { de: [
    "Was erfüllt mich heute auf angenehme Weise?",
    "Wo spüre ich Zufriedenheit in meinem Leben?",
    "Was genieße ich im Moment wirklich?",
    "Welche kleine Erfüllung darf ich bewusst wahrnehmen?",
    "Wo fühle ich mich innerlich rund und zufrieden?",
    "Was tut mir gerade richtig gut?",
    "Welche Wünsche haben sich schon erfüllt?"
  ]},
  tief: { de: [
    "Was bedeutet echte Zufriedenheit für mich?",
    "Wo fühle ich mich innerlich reich?",
    "Welche Erfüllung kommt nicht von außen, sondern aus mir selbst?",
    "Was genieße ich, ohne mich dafür rechtfertigen zu müssen?",
    "Welche Sehnsucht hat Frieden gefunden?",
    "Wo darf ich mein Glück annehmen?",
    "Was nährt mein Gefühl von innerer Fülle?"
  ]},
  existenziell: { de: [
    "Was macht mein Leben wirklich erfüllt?",
    "Welche Form von Glück ist für mich nährend?",
    "Woran merke ich, dass ich innerlich angekommen bin?",
    "Was wünsche ich mir – und was davon brauche ich gar nicht mehr?",
    "Wie fühlt sich Fülle an, wenn sie nicht von Leistung abhängt?",
    "Was ist für mich ein gelungenes Leben im Kleinen?"
  ]}
},

"C10": { // Zehn der Kelche
  sanft: { de: [
    "Wo erlebe ich heute ein Gefühl von Herzfrieden?",
    "Welche Menschen schenken mir Geborgenheit?",
    "Wo spüre ich Dankbarkeit für mein Miteinander?",
    "Was gibt mir ein Gefühl von emotionalem Zuhause?",
    "Welche Beziehung trägt Wärme und Vertrauen?",
    "Was macht dein Leben gerade reich?",
    "Welche Beziehung trägt dich?",
    "Wo darf ich mich heute verbunden fühlen?"
  ]},
  tief: { de: [
    "Welche Verbindung gibt mir das Gefühl, ganz gemeint zu sein?",
    "Was braucht mein Herz, um sich zuhause zu fühlen?",
    "Wo erlebe ich Liebe nicht als Drama, sondern als Ruhe?",
    "Welche Form von Nähe trägt mein Leben?"
  ]},
  existenziell: { de: [
    "Welche Beziehungen machen mein Leben ganz?",
    "Wo finde ich Zugehörigkeit, ohne mich zu verbiegen?",
    "Wo beginnt für mich das Gefühl von Heimat im Herzen?",
    "Was bedeutet ein erfülltes Leben für dich?",
    "Wie möchte ich Liebe leben, damit sie Frieden trägt?",
    "Wofür ist dein Herz dankbar, auch ohne Worte?"
  ]}
},

"C11": { // Bube der Kelche
  sanft: { de: [
    "Welches Gefühl zeigt sich in mir noch ganz zart?",
    "Wo spüre ich heute Offenheit und Neugier?",
    "Was überrascht mein Herz im Moment?",
    "Wo darf ich weicher und spielerischer sein?",
    "Was berührt mich auf unerwartete Weise?",
    "Was will durch dich ausgedrückt werden?"
  ]},
  tief: { de: [
    "Welche zarte Wahrheit meines Herzens möchte ich ernst nehmen?",
    "Wo beginnt in mir etwas Neues zu fühlen?",
    "Was würde geschehen, wenn ich meinem Herzen unvoreingenommen zuhöre?",
    "Wovon träumst du, das du nicht lebst?",
    "Welches Gefühl möchte ich nicht gleich erklären, sondern erst einmal kennenlernen?",
    "Was wäre, wenn Empfindsamkeit deine Stärke ist?",
    "Welche Form von Offenheit wünsche ich mir zurück?"
  ]},
  existenziell: { de: [
    "Wie bewahre ich die Offenheit meines Herzens in einer harten Welt?",
    "Welche Form von Unschuld möchte in mir lebendig bleiben?",
    "Was beginnt, wenn ich dem Zarten in mir vertraue?",
    "Welche innere Botschaft erreicht mich gerade auf leise Weise?",
    "Wie möchte ich mit meiner Empfindsamkeit leben?",
    "Was sagt mir mein Herz, bevor mein Verstand eingreift?",
    "Welche neue Form von Liebe oder Kreativität will in mir geboren werden?"
  ]}
},

"C12": { // Ritter der Kelche
  sanft: { de: [
    "Welche Sehnsucht bewegt mein Herz gerade?",
    "Wo folge ich einem Gefühl mit Hoffnung?",
    "Wem kannst du heute Mitgefühl zeigen?",
    "Wo wünsche ich mir mehr Romantik oder Schönheit?",
    "Was berührt mich so, dass ich in Bewegung komme?"
  ]},
  tief: { de: [
    "Welchem Gefühl bin ich bereit zu folgen?",
    "Welche Sehnsucht ist stark genug, mich in Bewegung zu bringen?",
    "Was trage ich in mir, das in Beziehung will?",
    "Was idealisierst du in anderen, das du in dir suchst?"
  ]},
  existenziell: { de: [
    "Welcher Ruf meines Herzens verdient es, gelebt zu werden?",
    "Wie liebe ich, wenn ich meiner Sehnsucht vertraue?",
    "Was wäre, wenn Liebe kein Ziel ist, sondern ein Weg, sei die Liebe, die du dir wünschst?",
    "Was bin ich bereit, aus Liebe oder Wahrhaftigkeit zu leben?",
    "Wohin folgt dein Mitgefühl – und was kostet dich das?",
    "Welche Schönheit oder Wahrheit möchte ich in die Welt tragen?",
    "Wie möchte ich die Tiefe meines Herzens leben?"
  ]}
},

"C13": { // Königin der Kelche
  sanft: { de: [
    "Wo spüre ich heute Mitgefühl – für mich oder andere?",
    "Welche innere Ruhe trägt mich gerade?",
    "Wo darf ich meinem Gefühl vertrauen?",
    "Was nährt die Tiefe meiner Gefühle?",
    "Welche Form von Fürsorge erfüllt mich?"
  ]},
  tief: { de: [
    "Wo vertraue ich meiner Intuition mehr als äußeren Stimmen?",
    "Wie gehe ich fürsorglich mit meiner inneren Welt um?",
    "Was nimmst du auf dich, das dir nicht gehört?",
    "Welche Tiefe in mir möchte geachtet werden?",
    "Wo verlierst du dich in den Gefühlen anderer?",
    "Wo zeigt sich meine Fähigkeit, zu fühlen, ohne darin zu ertrinken?",
    "Was hilft mir, offen und zugleich klar zu bleiben?",
    "Wo grenzt du dich nicht ab, weil du nicht verletzen willst?"
  ]},
  existenziell: { de: [
    "Wie möchte ich meine Sensibilität als Stärke leben?",
    "Was bedeutet es für mich, mit offenem Herzen und klarem Inneren zu leben?",
    "Wie trage ich Mitgefühl, ohne mich selbst zu verlieren?",
    "Wie kann meine Sanftheit heilsam in die Welt kommen?"
  ]}
},

"C14": { // König der Kelche
  sanft: { de: [
    "Wie bleibe ich ruhig in mir, auch wenn es um mich herum sehr chaotisch ist?",
    "Welche Ruhe hilft mir heute, klar zu bleiben?",
    "Wo gelingt es mir, Herz und Haltung zusammenzubringen?",
    "Was unterstützt mich darin, innerlich ausgeglichen zu bleiben?",
    "Wo zeige ich emotionale Reife?",
    "Was hilft mir, mit meinen Gefühlen freundlich umzugehen?",
    "Wo kann ich heute zugleich weich und klar sein?"
  ]},
  tief: { de: [
    "Wie halte ich meine Gefühle, ohne von ihnen fortgetragen zu werden?",
    "Welche Erfahrung hat mir innere Ruhe geschenkt?",
    "Wo wünsche ich mir mehr Souveränität im Fühlen?",
    "Was bedeutet für mich ein reifes Herz?",
    "Wo trägst du die Emotionen anderer, statt deine eigenen?",
    "Wie bleibe ich im Kontakt, ohne mich zu verlieren?"
  ]},
  existenziell: { de: [
    "Was heißt es für mich, ein verlässliches Herz zu haben?",
    "Wie verkörpere ich Liebe, ohne mich aufzugeben?",
    "Welche innere Haltung lässt mich im Sturm ruhig bleiben?",
    "Was bedeutet innere Reife für mich wirklich?",
    "Was trägst du in dir, das die Welt braucht?",
  ]}
},

  // ─────────────────────────────────────────
  // SCHWERTER
  // ─────────────────────────────────────────

  "S01": { // Ass der Schwerter
    sanft: { de: [
      "Welche Klarheit kommt gerade zu dir?",
      "Was kannst du heute mit einem klaren Gedanken beginnen?",
      "Welche Wahrheit darf heute ausgesprochen werden?"
    ]},
    tief: { de: [
      "Was willst du nicht klar sehen?",
      "Welche Wahrheit vermeidest du?",
      "Was würde sich verändern, wenn du die Dinge beim Namen nennen würdest?"
    ]},
    existenziell: { de: [
      "Was ist deine schärfste Wahrheit?",
      "Was wäre, wenn Klarheit befreit – auch wenn sie schmerzt?",
      "Was liegt jenseits aller deiner Überzeugungen?"
    ]}
  },

  "S02": { // Zwei der Schwerter
    sanft: { de: [
      "Was darf heute noch unentschieden bleiben?",
      "Wo hilft es, einen Moment zu pausieren?",
      "Was brauchst du, bevor du entscheidest?"
    ]},
    tief: { de: [
      "Was siehst du nicht – weil du die Augen verschlossen hast?",
      "Welche Entscheidung vermeidest du – und warum?",
      "Was kostet dich das Nicht-Entscheiden?"
    ]},
    existenziell: { de: [
      "Was wäre, wenn es keine falsche Wahl gibt?",
      "Was fürchtest du zu sehen, wenn du die Binde löst?",
      "Was liegt jenseits der Entscheidung?"
    ]}
  },

  "S03": { // Drei der Schwerter
    sanft: { de: [
      "Was schmerzt – und darf es?",
      "Wo darfst du heute traurig sein?",
      "Was braucht Raum – ohne sofort besser zu werden?"
    ]},
    tief: { de: [
      "Welchen Schmerz trägst du schon zu lange allein?",
      "Was hat dein Herz gebrochen – und du hast es nie wirklich gefühlt?",
      "Wo verschließt du dich vor dem Schmerz?"
    ]},
    existenziell: { de: [
      "Was hat Schmerz dich über dich selbst gelehrt?",
      "Was wäre, wenn Herzschmerz das Herz öffnet?",
      "Was bleibt, nachdem der Schmerz nachlässt?"
    ]}
  },

  "S04": { // Vier der Schwerter
    sanft: { de: [
      "Was braucht heute Ruhe statt Aktivität?",
      "Wo darfst du dich erholen?",
      "Was lässt du los, wenn du zur Stille kommst?"
    ]},
    tief: { de: [
      "Was treibst du weiter, obwohl du erschöpft bist?",
      "Wovor schützt dich die Aktivität?",
      "Was zeigt sich, wenn du wirklich zur Ruhe kommst?"
    ]},
    existenziell: { de: [
      "Was bedeutet echte Erholung für dich?",
      "Was wäre, wenn Stille keine Leere ist?",
      "Wer bist du, wenn du nichts tust?"
    ]}
  },

  "S05": { // Fünf der Schwerter
    sanft: { de: [
      "Was kannst du heute loslassen – auch wenn du Recht hast?",
      "Wo lohnt sich der Kampf nicht?",
      "Was wäre, wenn du gewinnst, indem du gehst?"
    ]},
    tief: { de: [
      "Was kostet dich dein Müssen-Recht-Haben?",
      "Wen verletzt du in deinem Beharren?",
      "Was gewinnst du wirklich, wenn du gewinnst?"
    ]},
    existenziell: { de: [
      "Was bedeutet Sieg für dich – und auf wessen Kosten?",
      "Was wäre, wenn du niemanden besiegen müsstest?",
      "Was bleibt, wenn der Konflikt vorbei ist?"
    ]}
  },

  "S06": { // Sechs der Schwerter
    sanft: { de: [
      "Wohin bewegst du dich gerade – innerlich?",
      "Was lässt du hinter dir?",
      "Welcher ruhigere Ort wartet auf dich?"
    ]},
    tief: { de: [
      "Was nimmst du mit, das du loslassen solltest?",
      "Welche Unruhe begleitet dich überall hin?",
      "Wovor fliehst du – auch wenn du es Aufbruch nennst?"
    ]},
    existenziell: { de: [
      "Was bedeutet Übergang für dich?",
      "Was wäre, wenn der Weg selbst die Heilung ist?",
      "Wohin gehst du, wenn du wirklich bei dir ankommst?"
    ]}
  },

  "S07": { // Sieben der Schwerter
    sanft: { de: [
      "Wo kannst du heute klug statt direkt vorgehen?",
      "Was brauchst du für dich – ohne jemanden zu verletzen?",
      "Welche Strategie fühlt sich integer an?"
    ]},
    tief: { de: [
      "Wo bist du unehrlich – dir selbst oder anderen?",
      "Was nimmst du, ohne zu fragen?",
      "Welche Lüge erzählst du dir – und warum?"
    ]},
    existenziell: { de: [
      "Was bedeutet Integrität für dich?",
      "Was wäre, wenn du dich selbst nicht betrügen könntest?",
      "Was trägst du fort, das dir nicht gehört?"
    ]}
  },

  "S08": { // Acht der Schwerter
    sanft: { de: [
      "Was hindert dich – und ist kleiner als es scheint?",
      "Welcher Gedanke hält dich gefangen?",
      "Was wäre der kleinste Schritt in Freiheit?"
    ]},
    tief: { de: [
      "Welche Geschichte erzählst du dir über deine Gefangenschaft?",
      "Was würde sich zeigen, wenn du die Binde abnimmst?",
      "Wer hat die Fesseln wirklich angelegt?"
    ]},
    existenziell: { de: [
      "Was wäre, wenn du freier bist als du glaubst?",
      "Was hält dich – wirklich?",
      "Was wird möglich, wenn du aufhörst, dir selbst im Weg zu stehen?"
    ]}
  },

  "S09": { // Neun der Schwerter
    sanft: { de: [
      "Was macht dir Sorgen – und darf es kleiner sein?",
      "Welcher Gedanke braucht heute Mitgefühl statt Glauben?",
      "Was hilft dir, wenn die Angst groß wird?"
    ]},
    tief: { de: [
      "Welche Angst dominiert dein Denken?",
      "Was erzählst du dir im Dunkeln, das nicht wahr ist?",
      "Wo quälst du dich mit Szenarien, die nie eintreten?"
    ]},
    existenziell: { de: [
      "Was ist deine tiefste Angst – und was sagt sie über dich?",
      "Was wäre, wenn dein größter Schmerz ein Lehrer ist?",
      "Was bleibt, wenn du der Angst ins Gesicht siehst?"
    ]}
  },

  "S10": { // Zehn der Schwerter
    sanft: { de: [
      "Was ist zu Ende – und darf es sein?",
      "Welcher Schmerz hat seinen Tiefpunkt erreicht?",
      "Was kommt nach dem Ende?"
    ]},
    tief: { de: [
      "Was dramatisierst du – und warum?",
      "Welchen Untergang hast du überlebt, den du nicht hinter dir lässt?",
      "Was hält dich im tiefsten Punkt?"
    ]},
    existenziell: { de: [
      "Was bedeutet es, ganz unten gewesen zu sein?",
      "Was wäre, wenn das Ende der tiefste Neubeginn ist?",
      "Was überlebt in dir, auch wenn alles andere fällt?"
    ]}
  },

  "S11": { // Bube der Schwerter
    sanft: { de: [
      "Welche neue Idee beflügelt deinen Geist?",
      "Was möchtest du heute herausfinden?",
      "Welche Frage brennt in dir?"
    ]},
    tief: { de: [
      "Wo redest du, ohne zu handeln?",
      "Was weißt du – und lebst es nicht?",
      "Welche Kritik übst du an anderen, die dir selbst gilt?"
    ]},
    existenziell: { de: [
      "Was ist der Unterschied zwischen Wissen und Weisheit für dich?",
      "Was wäre, wenn dein Geist dir dient – statt dich treibt?",
      "Was würdest du sagen, wenn du wirklich schweigen könntest?"
    ]}
  },

  "S12": { // Ritter der Schwerter
    sanft: { de: [
      "Wo kannst du heute mit klarem Kopf vorgehen?",
      "Welche Wahrheit ist es wert, ausgesprochen zu werden?",
      "Was treibt dich mit guten Gründen voran?"
    ]},
    tief: { de: [
      "Wo überrennst du andere mit deiner Meinung?",
      "Was kostet dich dein Tempo?",
      "Wen verletzt du in deiner Direktheit?"
    ]},
    existenziell: { de: [
      "Was wäre, wenn Stärke manchmal Schweigen bedeutet?",
      "Wofür kämpfst du wirklich?",
      "Was bleibt von deiner Wahrheit, wenn du sie nicht verteidigst?"
    ]}
  },

  "S13": { // Königin der Schwerter
    sanft: { de: [
      "Was kannst du heute mit Klarheit und Mitgefühl sagen?",
      "Welche Grenze darfst du heute ziehen?",
      "Was siehst du klarer als andere?"
    ]},
    tief: { de: [
      "Wo benutzt du Schärfe als Schutz?",
      "Was verbirgst du hinter deiner Kälte?",
      "Welcher Schmerz hat dich so klar gemacht?"
    ]},
    existenziell: { de: [
      "Was bedeutet es, unabhängig zu denken?",
      "Was wäre, wenn deine Einsamkeit deine Stärke gemacht hat?",
      "Was siehst du, das andere nicht sehen wollen?"
    ]}
  },

  "S14": { // König der Schwerter
    sanft: { de: [
      "Wo kannst du heute gerecht und klar entscheiden?",
      "Was braucht einen klaren, ruhigen Geist?",
      "Welche Wahrheit kann heute mit Würde gesprochen werden?"
    ]},
    tief: { de: [
      "Wo bist du kalt, wo Wärme gefragt wäre?",
      "Was unterdrückst du in dir, um rational zu wirken?",
      "Wessen Gefühle übergibst du deiner Logik?"
    ]},
    existenziell: { de: [
      "Was bedeutet Gerechtigkeit für dich – wirklich?",
      "Was wäre, wenn Wahrheit und Mitgefühl sich nicht widersprechen?",
      "Was ist dein Urteil über dein eigenes Leben?"
    ]}
  },

  // ─────────────────────────────────────────
  // MÜNZEN
  // ─────────────────────────────────────────

  "P01": { // Ass der Münzen
    sanft: { de: [
      "Welche neue Möglichkeit zeigt sich dir im Alltag?",
      "Was kannst du heute mit deinen Händen erschaffen?",
      "Welcher erste Schritt in etwas Konkretes fühlt sich richtig an?"
    ]},
    tief: { de: [
      "Was hält dich davon ab, deine Ressourcen zu nutzen?",
      "Wo vertraust du der Fülle nicht?",
      "Was wäre, wenn Sicherheit in dir beginnt, nicht außen?"
    ]},
    existenziell: { de: [
      "Was bedeutet Reichtum für dich – wirklich?",
      "Was wäre, wenn die Erde dich trägt, wenn du ihr vertraust?",
      "Was willst du aufbauen, das bleibt?"
    ]}
  },

  "P02": { // Zwei der Münzen
    sanft: { de: [
      "Was jonglierst du gerade – und was darf warten?",
      "Wo kannst du heute Prioritäten setzen?",
      "Was hält sich gerade im Gleichgewicht?"
    ]},
    tief: { de: [
      "Wo überlastest du dich damit, alles im Griff zu halten?",
      "Was würde passieren, wenn du eine Sache loslässt?",
      "Wo verausgabst du dich für Kontrolle?"
    ]},
    existenziell: { de: [
      "Was bedeutet Balance für dein Leben – wirklich?",
      "Was wäre, wenn du nicht alles gleichzeitig sein musst?",
      "Was bleibt, wenn du aufhörst zu jonglieren?"
    ]}
  },

  "P03": { // Drei der Münzen
    sanft: { de: [
      "Mit wem kannst du heute gut zusammenarbeiten?",
      "Was erschaffst du, das größer ist als du allein?",
      "Welche Fähigkeit kannst du heute einbringen?"
    ]},
    tief: { de: [
      "Wo arbeitest du, ohne gesehen zu werden – und leidest darunter?",
      "Was hältst du zurück, weil du dich nicht gut genug fühlst?",
      "Wo erkennst du die Meisterschaft anderer nicht an?"
    ]},
    existenziell: { de: [
      "Was willst du mit anderen gemeinsam erschaffen?",
      "Was ist dein Beitrag zur Welt – konkret?",
      "Was wäre, wenn Meisterschaft ein Weg ist, kein Ziel?"
    ]}
  },

  "P04": { // Vier der Münzen
    sanft: { de: [
      "Was möchtest du heute schützen – mit gutem Grund?",
      "Wo ist Vorsicht angebracht?",
      "Was gibt dir materielle oder emotionale Sicherheit?"
    ]},
    tief: { de: [
      "Was hältst du so fest, dass es dich einengt?",
      "Wovor hast du Angst, wenn du loslässt?",
      "Was kostet dich dein Festhalten?"
    ]},
    existenziell: { de: [
      "Was wäre, wenn echte Sicherheit nicht besessen werden kann?",
      "Was hält dich – und was hältst du?",
      "Was würdest du verschenken, wenn du nichts verlieren könntest?"
    ]}
  },

  "P05": { // Fünf der Münzen
    sanft: { de: [
      "Was brauchst du gerade – und darfst darum bitten?",
      "Wo ist Hilfe nah, die du noch nicht gesehen hast?",
      "Was darf heute weniger sein?"
    ]},
    tief: { de: [
      "Wo fühlst du dich ausgeschlossen – und warum?",
      "Was verhindert, dass du Hilfe annimmst?",
      "Welcher Mangel ist tief in dir verwurzelt?"
    ]},
    existenziell: { de: [
      "Was bedeutet Würde im Mangel für dich?",
      "Was wäre, wenn Not ein Ruf zur Gemeinschaft ist?",
      "Was trägst du durch die Kälte – und wofür?"
    ]}
  },

  "P06": { // Sechs der Münzen
    sanft: { de: [
      "Was kannst du heute großzügig teilen?",
      "Wo darf Geben und Nehmen im Gleichgewicht sein?",
      "Wem kannst du heute etwas Gutes tun?"
    ]},
    tief: { de: [
      "Gibst du aus Großzügigkeit – oder aus Kontrolle?",
      "Wo nimmst du, ohne zu geben?",
      "Was kostet dich deine Großzügigkeit wirklich?"
    ]},
    existenziell: { de: [
      "Was bedeutet echtes Geben für dich?",
      "Was wäre, wenn Fülle nur im Fluss entsteht?",
      "Was wäre die Welt, wenn jeder gäbe, was er kann?"
    ]}
  },

  "P07": { // Sieben der Münzen
    sanft: { de: [
      "Was wächst gerade – auch wenn du es nicht siehst?",
      "Wo darf Geduld mit deinem Prozess sein?",
      "Was hast du gesät, das Zeit braucht?"
    ]},
    tief: { de: [
      "Wo zweifelst du an deiner Arbeit – zu früh?",
      "Was sabotierst du durch Ungeduld?",
      "Was würde wachsen, wenn du aufhörst zu ziehen?"
    ]},
    existenziell: { de: [
      "Was willst du ernten – in deinem Leben?",
      "Was wäre, wenn das Warten selbst die Reife ist?",
      "Was hinterlässt du, das nach dir wächst?"
    ]}
  },

  "P08": { // Acht der Münzen
    sanft: { de: [
      "Welche Aufgabe kannst du heute mit Hingabe tun?",
      "Was macht dir Freude, wenn du es gut machst?",
      "Wo kannst du heute einfach üben – ohne Ergebnis?"
    ]},
    tief: { de: [
      "Was arbeitest du – aber nicht wofür du brennst?",
      "Wo verlierst du dich in Perfektionismus?",
      "Was würdest du meistern, wenn du keine Angst vor dem Prozess hättest?"
    ]},
    existenziell: { de: [
      "Was ist dein Handwerk – im tiefsten Sinne?",
      "Was wäre, wenn Meisterschaft Hingabe an den Moment ist?",
      "Was erschaffst du, das dich überdauert?"
    ]}
  },

  "P09": { // Neun der Münzen
    sanft: { de: [
      "Was hast du dir erarbeitet, das du heute genießen darfst?",
      "Wo bist du unabhängiger als du denkst?",
      "Was gibt dir ein Gefühl von Würde und Fülle?"
    ]},
    tief: { de: [
      "Wo kaufst du dir Sicherheit, statt sie zu fühlen?",
      "Was fehlt dir trotz allem, was du erreicht hast?",
      "Wo bist du allein – obwohl du alles hast?"
    ]},
    existenziell: { de: [
      "Was bedeutet Selbstständigkeit wirklich für dich?",
      "Was wäre, wenn Fülle ein innerer Zustand ist?",
      "Was hast du dir selbst gegeben, das niemand dir nehmen kann?"
    ]}
  },

  "P10": { // Zehn der Münzen
    sanft: { de: [
      "Was gibt dir heute ein Gefühl von Beständigkeit?",
      "Was hat Bestand in deinem Leben?",
      "Welches Erbe trägst du weiter?"
    ]},
    tief: { de: [
      "Was erbst du – und willst du es wirklich?",
      "Wo lebst du für die Erwartungen anderer Generationen?",
      "Was kostet dich Sicherheit an Lebendigkeit?"
    ]},
    existenziell: { de: [
      "Was willst du hinterlassen?",
      "Was bedeutet Familie oder Gemeinschaft für dich – tief?",
      "Was wäre dein Beitrag zu dem, was bleibt?"
    ]}
  },

  "P11": { // Bube der Münzen
    sanft: { de: [
      "Was möchtest du heute lernen – praktisch?",
      "Welche neue Fähigkeit kannst du heute üben?",
      "Was interessiert dich, das du noch nicht ausprobiert hast?"
    ]},
    tief: { de: [
      "Wo bist du ungeduldig mit deinem eigenen Lernprozess?",
      "Was gibst du auf, bevor es Früchte trägt?",
      "Was hält dich davon ab, wirklich anzufangen?"
    ]},
    existenziell: { de: [
      "Was willst du wirklich können – in diesem Leben?",
      "Was wäre, wenn Anfänger sein eine Gnade ist?",
      "Was wächst in dir, das noch keinen Namen hat?"
    ]}
  },

  "P12": { // Ritter der Münzen
    sanft: { de: [
      "Was kannst du heute zuverlässig und gründlich tun?",
      "Wo zahlt sich Beständigkeit aus?",
      "Was verdient heute deine volle Aufmerksamkeit?"
    ]},
    tief: { de: [
      "Wo bist du stur, wo Flexibilität gefragt wäre?",
      "Was tust du aus Pflicht – nicht aus Liebe?",
      "Was kostet dich dein Festhalten an Routine?"
    ]},
    existenziell: { de: [
      "Was bedeutet es, wirklich verlässlich zu sein?",
      "Was wäre, wenn Beständigkeit und Lebendigkeit sich nicht widersprechen?",
      "Was baust du – Schritt für Schritt – das wirklich zählt?"
    ]}
  },

  "P13": { // Königin der Münzen
    sanft: { de: [
      "Wie kannst du heute für dich und andere sorgen?",
      "Was nährt dich – körperlich, praktisch, real?",
      "Wo kannst du Geborgenheit schaffen?"
    ]},
    tief: { de: [
      "Wo pflegst du andere – und vernachlässigst dich?",
      "Was gibst du, weil du dich sonst nicht wertvoll fühlst?",
      "Was kostet dich deine Fürsorge?"
    ]},
    existenziell: { de: [
      "Was bedeutet Heimat für dich – in dir selbst?",
      "Was wäre, wenn du dir selbst die fürsorgende Mutter wärst?",
      "Was wächst, wenn du es liebevoll pflegst?"
    ]}
  },

  "P14": { // König der Münzen
    sanft: { de: [
      "Was kannst du heute mit Großzügigkeit und Weisheit gestalten?",
      "Wo kannst du Sicherheit für andere schaffen?",
      "Was trägst du mit ruhiger Stärke?"
    ]},
    tief: { de: [
      "Wo identifizierst du dich zu sehr mit dem, was du besitzt?",
      "Was würdest du sein, ohne deinen materiellen Erfolg?",
      "Wo kaufst du Einfluss, statt ihn zu verdienen?"
    ]},
    existenziell: { de: [
      "Was bedeutet wahrer Reichtum für dich?",
      "Was wäre, wenn Sicherheit ein Geschenk ist, das du weitergibst?",
      "Was hinterlässt du, das mehr wert ist als Geld?"
    ]}
  },

};

const questionDecks: Record<string, string[]> = {};
const deckPositions: Record<string, number> = {};

function shuffleArray(arr: string[]): string[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestion(
  cardId: string,
  depth: "sanft" | "tief" | "existenziell",
  locale: string
): string | null {
  const lang = locale.split("-")[0];
  const list =
    QUESTIONS[cardId]?.[depth]?.[lang] ??
    QUESTIONS[cardId]?.[depth]?.["de"];

  if (!list || list.length === 0) return null;

  const key = `${cardId}_${depth}_${lang}`;

  if (!questionDecks[key] || deckPositions[key] >= questionDecks[key].length) {
    questionDecks[key] = shuffleArray(list);
    deckPositions[key] = 0;
  }

  const question = questionDecks[key][deckPositions[key]];
  deckPositions[key]++;
  return question;
}