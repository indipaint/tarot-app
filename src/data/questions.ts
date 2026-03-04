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
      "Was würdest du tun, wenn du nichts zu verlieren hättest?",
      "Wo darfst du heute leichter sein?",
      "Welcher erste Schritt fühlt sich spielerisch an?"
    ]},
    tief: { de: [
      "Was hält dich davon ab, wirklich loszulassen?",
      "Wo versteckst du deine Unbekümmertheit?",
      "Was würdest du riskieren, wenn Scheitern keine Rolle spielte?"
    ]},
    existenziell: { de: [
      "Wer bist du, bevor die Welt dich geformt hat?",
      "Was wäre, wenn der Sprung ins Unbekannte dich rettet?",
      "Welchen Teil von dir hast du aufgehört zu sein?"
    ]}
  },

  "01": { // Der Magier
    sanft: { de: [
      "Welche Fähigkeit darfst du heute einsetzen?",
      "Was hast du bereits, das du unterschätzt?",
      "Welche kleine Handlung kannst du jetzt vollziehen?"
    ]},
    tief: { de: [
      "Was vermeidest du wirklich zu fühlen?",
      "Wo sabotierst du dich selbst?",
      "Was würde sich verändern, wenn du ehrlicher wärst?"
    ]},
    existenziell: { de: [
      "Wer wärst du ohne deine Angst?",
      "Was in dir will erschaffen werden?",
      "Welche Wahrheit traust du dich nicht auszusprechen?"
    ]}
  },

  "02": { // Die Hohepriesterin
    sanft: { de: [
      "Was sagt dir deine Stille gerade?",
      "Welchem inneren Impuls darfst du vertrauen?",
      "Was weißt du, ohne es erklären zu können?"
    ]},
    tief: { de: [
      "Was verbirgst du vor dir selbst?",
      "Welches Wissen wartet darauf, gehört zu werden?",
      "Wo ignorierst du deine Intuition?"
    ]},
    existenziell: { de: [
      "Was liegt jenseits dessen, was du weißt?",
      "Welches Geheimnis trägst du, das niemand kennt?",
      "Was würde entstehen, wenn du aufhörst zu suchen?"
    ]}
  },

  "03": { // Die Herrscherin
    sanft: { de: [
      "Womit kannst du dich heute nähren?",
      "Was blüht gerade in deinem Leben?",
      "Wo darfst du dich um dich selbst kümmern?"
    ]},
    tief: { de: [
      "Wo hast du aufgehört, dich selbst zu lieben?",
      "Was blockiert dein Wachstum?",
      "Wo gibst du mehr, als du empfängst?"
    ]},
    existenziell: { de: [
      "Was willst du auf dieser Welt erschaffen?",
      "Welche Art von Leben willst du gebären?",
      "Was wäre, wenn Fülle dein natürlicher Zustand wäre?"
    ]}
  },

  "04": { // Der König
    sanft: { de: [
      "Wo kannst du heute Struktur schaffen?",
      "Was gibt dir gerade Stabilität?",
      "Welche Entscheidung wartet auf dich?"
    ]},
    tief: { de: [
      "Wo übst du Kontrolle aus, wo du loslassen solltest?",
      "Was kostet dich deine Starrheit?",
      "Wessen Erwartungen erfüllst du – und warum?"
    ]},
    existenziell: { de: [
      "Was würde es bedeuten, wirklich Verantwortung zu übernehmen?",
      "Welche Macht hast du, die du nicht annimmst?",
      "Wofür willst du in Erinnerung bleiben?"
    ]}
  },

  "05": { // Der Hohepriester
    sanft: { de: [
      "Welche Weisheit trägt dich gerade?",
      "Von wem darfst du heute lernen?",
      "Was gibt dir inneren Halt?"
    ]},
    tief: { de: [
      "Welchen Regeln folgst du blind?",
      "Wo hat Tradition dich eingeengt?",
      "Was glaubst du, weil man es dir gesagt hat?"
    ]},
    existenziell: { de: [
      "Was ist heilig für dich – wirklich heilig?",
      "Welche Überzeugung trägt dich – und welche begrenzt dich?",
      "Was wäre, wenn du deine eigene Autorität wärst?"
    ]}
  },

  "06": { // Die Liebenden
    sanft: { de: [
      "Was liebst du gerade in deinem Leben?",
      "Welche Verbindung nährt dich?",
      "Wo darfst du dich heute öffnen?"
    ]},
    tief: { de: [
      "Welche Wahl vermeidest du zu treffen?",
      "Wo bist du dir selbst gegenüber unehrlich in Beziehungen?",
      "Was opferst du für Harmonie, das du nicht opfern solltest?"
    ]},
    existenziell: { de: [
      "Was bedeutet Liebe für dich wirklich?",
      "Wen oder was wählst du – immer wieder?",
      "Was wäre, wenn du dich selbst so liebtest wie jemand anderen?"
    ]}
  },

  "07": { // Der Wagen
    sanft: { de: [
      "Worauf kannst du heute fokussiert bleiben?",
      "Was treibt dich gerade voran?",
      "Welcher kleine Sieg verdient Anerkennung?"
    ]},
    tief: { de: [
      "Was kämpfst du, das du nicht kämpfen müsstest?",
      "Wo versuchst du, alles zu kontrollieren?",
      "Wohin fährst du – und weißt du warum?"
    ]},
    existenziell: { de: [
      "Was ist dein wirklicher Antrieb?",
      "Wohin führt dich dein Weg, wenn du niemanden beeindrucken musst?",
      "Was würdest du tun, wenn Sieg nicht das Ziel wäre?"
    ]}
  },

  "08": { // Die Kraft
    sanft: { de: [
      "Wo bist du gerade mutiger als du denkst?",
      "Was gibt dir heute Kraft?",
      "Welche sanfte Stärke kannst du einsetzen?"
    ]},
    tief: { de: [
      "Was in dir willst du zähmen – und warum?",
      "Wo hast du Angst vor deiner eigenen Kraft?",
      "Was würdest du tun, wenn du wüsstest, dass du stark genug bist?"
    ]},
    existenziell: { de: [
      "Was ist die tiefste Form von Mut für dich?",
      "Wo beginnt wahre Stärke?",
      "Was wäre, wenn deine Verletzlichkeit deine größte Kraft wäre?"
    ]}
  },

  "09": { // Der Eremit
    sanft: { de: [
      "Was brauchst du gerade an Stille?",
      "Welche innere Stimme möchte gehört werden?",
      "Wo tut dir Rückzug gut?"
    ]},
    tief: { de: [
      "Wovor ziehst du dich zurück?",
      "Was findest du, wenn du wirklich allein bist?",
      "Welche Einsamkeit trägst du schon lange?"
    ]},
    existenziell: { de: [
      "Was ist deine tiefste innere Wahrheit?",
      "Wen triffst du, wenn du alle Rollen ablegst?",
      "Was leuchtet in dir, auch wenn niemand zuschaut?"
    ]}
  },

  "10": { // Rad des Schicksals
    sanft: { de: [
      "Was verändert sich gerade in deinem Leben?",
      "Welchem Wandel kannst du vertrauen?",
      "Was darf sich heute drehen?"
    ]},
    tief: { de: [
      "Welche Muster wiederholen sich in deinem Leben?",
      "Wo widersteht du dem Unvermeidlichen?",
      "Was müsste sich ändern, damit du wirklich frei bist?"
    ]},
    existenziell: { de: [
      "Was ist dein Anteil an dem, was dir widerfährt?",
      "Was bedeutet es, dem Leben zu vertrauen?",
      "Wenn alles sich dreht – was bleibt?"
    ]}
  },

  "11": { // Gerechtigkeit
    sanft: { de: [
      "Wo kannst du heute ehrlich mit dir sein?",
      "Was braucht gerade Klarheit statt Vermeidung?",
      "Welche Entscheidung fühlt sich fair an?"
    ]},
    tief: { de: [
      "Was hast du verdrängt, weil es unbequem ist?",
      "Wo bist du ungerecht – dir selbst gegenüber?",
      "Was müsstest du anerkennen, das du noch nicht siehst?"
    ]},
    existenziell: { de: [
      "Was schuldest du dir selbst?",
      "Was wäre, wenn du alles mit klaren Augen sehen würdest?",
      "Was bedeutet Wahrheit für dein Leben?"
    ]}
  },

  "12": { // Der Gehängte
    sanft: { de: [
      "Was darfst du heute loslassen?",
      "Wo hilft es, innezuhalten statt zu handeln?",
      "Was verändert sich, wenn du die Perspektive wechselst?"
    ]},
    tief: { de: [
      "Was hältst du fest, das dich aufhängt?",
      "Wo opferst du dich – und für wen?",
      "Was würdest du sehen, wenn du alles auf den Kopf stellst?"
    ]},
    existenziell: { de: [
      "Was muss sterben, damit etwas Neues entstehen kann?",
      "Welches Warten hat einen tieferen Sinn?",
      "Was wäre, wenn Stillstand die tiefste Bewegung ist?"
    ]}
  },

  "13": { // Der Tod
    sanft: { de: [
      "Was darf heute enden?",
      "Welcher Abschluss bringt dir Erleichterung?",
      "Was verabschiedest du dich von gerade?"
    ]},
    tief: { de: [
      "Was hältst du am Leben, obwohl es längst tot ist?",
      "Wovor hast du Angst, wenn du loslässt?",
      "Was müsste sterben, damit du wachsen kannst?"
    ]},
    existenziell: { de: [
      "Was bedeutet Vergänglichkeit für dein Leben?",
      "Wenn du wüsstest, dass alles endet – was würdest du anders tun?",
      "Was bleibt von dir, wenn alles andere geht?"
    ]}
  },

  "14": { // Mäßigkeit
    sanft: { de: [
      "Wo findest du heute deine Balance?",
      "Was braucht gerade Geduld statt Eile?",
      "Welche kleine Harmonie kannst du schaffen?"
    ]},
    tief: { de: [
      "Wo lebst du in Extremen, wo Mitte wäre?",
      "Was kostet dich dein Ungleichgewicht?",
      "Was mischt sich in dir, das noch keine Form gefunden hat?"
    ]},
    existenziell: { de: [
      "Was bedeutet innerer Frieden für dich?",
      "Wie würde dein Leben aussehen, wenn du wirklich im Fluss wärst?",
      "Was entsteht, wenn Gegensätze sich berühren?"
    ]}
  },

  "15": { // Der Teufel
    sanft: { de: [
      "Was bindet dich gerade – und kannst du es lockern?",
      "Wo darfst du ehrlich über eine Abhängigkeit sein?",
      "Was gibt dir Kraft, auch wenn es dir nicht guttut?"
    ]},
    tief: { de: [
      "Welche Kette hast du selbst geschmiedet?",
      "Was benutzt du, um nicht zu fühlen?",
      "Wo gibst du deine Macht ab?"
    ]},
    existenziell: { de: [
      "Was wärst du ohne das, woran du hängst?",
      "Welcher Schatten in dir will gesehen werden?",
      "Was würde Freiheit wirklich bedeuten?"
    ]}
  },

  "16": { // Der Turm
    sanft: { de: [
      "Was bricht gerade zusammen – und macht vielleicht Platz?",
      "Wo kannst du dem Chaos mit Atem begegnen?",
      "Was hat sich verändert, das du noch nicht akzeptiert hast?"
    ]},
    tief: { de: [
      "Was in deinem Leben ist auf falschen Fundamenten gebaut?",
      "Wovor hast du am meisten Angst zu verlieren?",
      "Was müsste einstürzen, damit etwas Wahres entstehen kann?"
    ]},
    existenziell: { de: [
      "Was bist du, wenn alles Äußere fällt?",
      "Was würde ein wirklicher Neuanfang bedeuten?",
      "Was ist unzerstörbar in dir?"
    ]}
  },

  "17": { // Der Stern
    sanft: { de: [
      "Wofür kannst du heute dankbar sein?",
      "Was gibt dir gerade Hoffnung?",
      "Welches Licht siehst du am Horizont?"
    ]},
    tief: { de: [
      "Wo hast du aufgehört zu hoffen?",
      "Was würde sich heilen, wenn du dich erlaubst zu träumen?",
      "Welche Wunde wartet auf Heilung?"
    ]},
    existenziell: { de: [
      "Was ist dein tiefster Wunsch für dein Leben?",
      "Worauf vertraust du, auch wenn du es nicht siehst?",
      "Was würde entstehen, wenn du dich vollständig öffnetest?"
    ]}
  },

  "18": { // Der Mond
    sanft: { de: [
      "Was ist gerade unklar – und darf es sein?",
      "Welchem Traum darfst du nachspüren?",
      "Was zeigt sich dir im Halbdunkel?"
    ]},
    tief: { de: [
      "Welche Illusionen hältst du für Wahrheit?",
      "Was verbirgt sich hinter deiner Angst?",
      "Welche Stimmen hörst du, die nicht deine sind?"
    ]},
    existenziell: { de: [
      "Was liegt in deiner Tiefe, das du nicht kennst?",
      "Was wäre, wenn das Unbewusste dir eine Botschaft schickt?",
      "Wer bist du jenseits dessen, was du verstehst?"
    ]}
  },

  "19": { // Die Sonne
    sanft: { de: [
      "Was macht dich heute einfach froh?",
      "Wo strahlst du, ohne es zu merken?",
      "Was darf heute leicht und hell sein?"
    ]},
    tief: { de: [
      "Wo versteckst du deine Freude?",
      "Was hindert dich daran, wirklich zu strahlen?",
      "Was wäre, wenn du dich erlaubst, gesehen zu werden?"
    ]},
    existenziell: { de: [
      "Was bedeutet Lebensfreude für dich – jenseits aller Umstände?",
      "Was ist dein Kern, wenn alles Dunkel sich lichtet?",
      "Wofür brennst du wirklich?"
    ]}
  },

  "20": { // Das Gericht
    sanft: { de: [
      "Was rufst du heute in dein Leben?",
      "Welcher neue Beginn wartet auf dich?",
      "Was darf auferstehen?"
    ]},
    tief: { de: [
      "Was urteilst du an dir selbst – zu hart?",
      "Welcher Ruf bleibt ungehört in dir?",
      "Was müsstest du vergeben, um wirklich neu zu beginnen?"
    ]},
    existenziell: { de: [
      "Was ist deine tiefste Berufung?",
      "Wenn du dein Leben neu gestalten könntest – was würde bleiben?",
      "Was würde es bedeuten, wirklich erwacht zu sein?"
    ]}
  },

  "21": { // Die Welt
    sanft: { de: [
      "Was hast du gerade vollendet, das Anerkennung verdient?",
      "Wo bist du angekommen?",
      "Was darf heute gefeiert werden?"
    ]},
    tief: { de: [
      "Was verhindert, dass du dich vollständig fühlst?",
      "Wo sabotierst du deinen eigenen Abschluss?",
      "Was fehlt dir noch – wirklich?"
    ]},
    existenziell: { de: [
      "Was bedeutet Vollständigkeit für dich?",
      "Was wäre, wenn du bereits alles bist, was du sein musst?",
      "Was ist der nächste Kreis deines Lebens?"
    ]}
  },

  // ─────────────────────────────────────────
  // STÄBE
  // ─────────────────────────────────────────

  "W01": { // Ass der Stäbe
    sanft: { de: [
      "Welcher neue Anfang klopft gerade an?",
      "Was würdest du tun, wenn du keine Angst hättest?",
      "Wo spürst du gerade Lebendigkeit?"
    ]},
    tief: { de: [
      "Was hält dich davon ab, wirklich anzufangen?",
      "Wo brennst du – und zeigst es nicht?",
      "Was willst du erschaffen, das noch keinen Namen hat?"
    ]},
    existenziell: { de: [
      "Wozu bist du wirklich hier?",
      "Was würde entstehen, wenn du dich völlig erlaubst?",
      "Welches Feuer in dir wartet darauf, entfacht zu werden?"
    ]}
  },

  "W02": { // Zwei der Stäbe
    sanft: { de: [
      "Wohin könntest du heute deinen Blick richten?",
      "Welche Möglichkeit liegt vor dir?",
      "Was planst du – mit Freude statt Druck?"
    ]},
    tief: { de: [
      "Worauf wartest du, bevor du losgehst?",
      "Was hält dich in der Vertrautheit gefangen?",
      "Welche Vision hast du aufgegeben?"
    ]},
    existenziell: { de: [
      "Was ist deine Welt – und wie groß darf sie sein?",
      "Wohin würdest du gehen, wenn alles möglich wäre?",
      "Was liegt jenseits deines Horizonts?"
    ]}
  },

  "W03": { // Drei der Stäbe
    sanft: { de: [
      "Was hast du auf den Weg gebracht, das jetzt wächst?",
      "Wo darfst du auf Ergebnisse warten?",
      "Was kommt auf dich zu – und du bist bereit?"
    ]},
    tief: { de: [
      "Was sendest du aus – und was erwartest du zurück?",
      "Wo bist du ungeduldig mit deinem eigenen Prozess?",
      "Was müsstest du loslassen, damit etwas zurückkommen kann?"
    ]},
    existenziell: { de: [
      "Was hinterlässt du in der Welt?",
      "Welche Reise hat wirklich begonnen?",
      "Was wächst in dir, das noch kein Ufer gesehen hat?"
    ]}
  },

  "W04": { // Vier der Stäbe
    sanft: { de: [
      "Was darf heute gefeiert werden?",
      "Wo bist du zuhause – in dir selbst?",
      "Was gibt dir gerade Sicherheit?"
    ]},
    tief: { de: [
      "Was fehlte dir an echtem Zuhause?",
      "Wo suchst du Zugehörigkeit, die du dir selbst geben könntest?",
      "Was würde sich verändern, wenn du dich wirklich willkommen heißt?"
    ]},
    existenziell: { de: [
      "Was bedeutet Heimat für dich – jenseits von Orten?",
      "Wo gehörst du wirklich hin?",
      "Was wäre, wenn du dein eigenes Zuhause wärst?"
    ]}
  },

  "W05": { // Fünf der Stäbe
    sanft: { de: [
      "Wo kannst du heute einen Konflikt sanft ansprechen?",
      "Was braucht Klärung statt Vermeidung?",
      "Welcher Widerstand hat einen Kern Wahrheit?"
    ]},
    tief: { de: [
      "Mit wem oder was kämpfst du wirklich?",
      "Was kostet dich dein innerer Widerstand?",
      "Wo streitest du, weil du dich nicht gehört fühlst?"
    ]},
    existenziell: { de: [
      "Was verteidigst du – und ist es das wert?",
      "Was wäre, wenn Konflikt Wachstum wäre?",
      "Was entsteht, wenn du aufhörst zu kämpfen?"
    ]}
  },

  "W06": { // Sechs der Stäbe
    sanft: { de: [
      "Welchen Erfolg darfst du heute anerkennen?",
      "Was hast du erreicht, das du übergangen hast?",
      "Wer verdient heute deine Anerkennung?"
    ]},
    tief: { de: [
      "Wessen Anerkennung suchst du – und warum?",
      "Was würde sich ändern, wenn du dir selbst applaudierst?",
      "Wo feierst du andere, aber nicht dich?"
    ]},
    existenziell: { de: [
      "Was bedeutet Erfolg für dich – wirklich?",
      "Wofür möchtest du gesehen werden?",
      "Was wäre, wenn du bereits genug geleistet hast?"
    ]}
  },

  "W07": { // Sieben der Stäbe
    sanft: { de: [
      "Wofür stehst du heute ein?",
      "Was ist es wert, verteidigt zu werden?",
      "Wo kannst du standhaft bleiben?"
    ]},
    tief: { de: [
      "Gegen wen oder was behauptest du dich – wirklich?",
      "Was kostet dich das Kämpfen auf diesem Hügel?",
      "Wo verteidigst du dich, wo du dich öffnen könntest?"
    ]},
    existenziell: { de: [
      "Was ist dein unverhandelbarer Kern?",
      "Wofür würdest du alles riskieren?",
      "Was wäre, wenn du nicht kämpfen müsstest, um zu existieren?"
    ]}
  },

  "W08": { // Acht der Stäbe
    sanft: { de: [
      "Was bewegt sich gerade schnell in deinem Leben?",
      "Welche Nachricht wartet auf dich?",
      "Was darf heute in Bewegung kommen?"
    ]},
    tief: { de: [
      "Was überwältigte dich durch seine Geschwindigkeit?",
      "Wo verlierst du dich im Tempo?",
      "Was müsstest du loslassen, um wirklich zu fliegen?"
    ]},
    existenziell: { de: [
      "Wohin trägt dich dein Leben gerade – willst du das?",
      "Was wäre, wenn Geschwindigkeit Klarheit wäre?",
      "Was fliegt auf dich zu, dem du dich stellst?"
    ]}
  },

  "W09": { // Neun der Stäbe
    sanft: { de: [
      "Was gibt dir heute Ausdauer?",
      "Wo bist du widerstandsfähiger als du denkst?",
      "Wie kannst du dich heute schützen, ohne dich zu verschließen?"
    ]},
    tief: { de: [
      "Was hat dich so vorsichtig gemacht?",
      "Welche alten Wunden bestimmen noch dein Verhalten?",
      "Wo bist du auf der Hut, wo Vertrauen möglich wäre?"
    ]},
    existenziell: { de: [
      "Was hast du durchgehalten – und was hat es dich gelehrt?",
      "Was wäre, wenn Erschöpfung der Preis für falsche Kämpfe ist?",
      "Welche Narben tragen deine Weisheit?"
    ]}
  },

  "W10": { // Zehn der Stäbe
    sanft: { de: [
      "Was kannst du heute ablegen?",
      "Welche Last ist nicht deine zu tragen?",
      "Wo darfst du um Hilfe bitten?"
    ]},
    tief: { de: [
      "Was trägst du, das du nicht loslassen willst – warum?",
      "Welche Verantwortung hast du übernommen, die nicht dir gehört?",
      "Was kostet dich deine Überbelastung wirklich?"
    ]},
    existenziell: { de: [
      "Was wäre dein Leben ohne diese Last?",
      "Was würdest du tun, wenn du frei wärst?",
      "Was hält dich davon ab, Hilfe anzunehmen?"
    ]}
  },

  "W11": { // Bube der Stäbe
    sanft: { de: [
      "Welche neue Idee begeistert dich gerade?",
      "Wo kannst du heute neugierig sein?",
      "Was möchtest du ausprobieren?"
    ]},
    tief: { de: [
      "Was startest du – und bringst nie zu Ende?",
      "Wo fehlt dir die Ausdauer hinter deiner Begeisterung?",
      "Was würde passieren, wenn du eine Sache wirklich durchziehst?"
    ]},
    existenziell: { de: [
      "Was entzündet dich – wirklich, tief?",
      "Wer bist du, wenn du vollkommen lebendig bist?",
      "Was wäre, wenn deine Unruhe eine Richtung sucht?"
    ]}
  },

  "W12": { // Ritter der Stäbe
    sanft: { de: [
      "Wohin kannst du heute mit Energie aufbrechen?",
      "Was treibt dich mit gutem Grund an?",
      "Welche Leidenschaft darf sich zeigen?"
    ]},
    tief: { de: [
      "Wo handelst du impulsiv statt weise?",
      "Was brennt in dir, das keine Richtung hat?",
      "Wen verletzt du in deinem Vorwärtsdrang?"
    ]},
    existenziell: { de: [
      "Was willst du wirklich – jenseits des Adrenalins?",
      "Wohin führt dich deine Leidenschaft, wenn du ihr voll folgst?",
      "Was wäre, wenn Feuer auch wärmen kann, nicht nur verbrennen?"
    ]}
  },

  "W13": { // Königin der Stäbe
    sanft: { de: [
      "Was gibst du heute mit Wärme und Stärke?",
      "Wo kannst du andere mit deiner Energie inspirieren?",
      "Was liebst du an deiner eigenen Kraft?"
    ]},
    tief: { de: [
      "Wo zeigst du Stärke, wo du Schwäche zeigen darfst?",
      "Was kostet es dich, immer die Starke zu sein?",
      "Wo verbirgst du deine eigene Bedürftigkeit?"
    ]},
    existenziell: { de: [
      "Was ist deine Flamme – unabhängig von allen anderen?",
      "Wer bist du, wenn du niemanden führst?",
      "Was wäre, wenn du deine Kraft nicht beweisen müsstest?"
    ]}
  },

  "W14": { // König der Stäbe
    sanft: { de: [
      "Wo kannst du heute mit Autorität und Wärme führen?",
      "Was inspiriert dich, andere zu inspirieren?",
      "Welche Vision trägst du mit dir?"
    ]},
    tief: { de: [
      "Wo herrschst du, wo du dienen solltest?",
      "Was kostet deinen Stolz die Wahrheit?",
      "Wessen Feuer unterdrückst du mit deinem eigenen?"
    ]},
    existenziell: { de: [
      "Was ist dein Vermächtnis – wirklich?",
      "Wofür setzt du deine Kraft ein – für dich oder für alle?",
      "Was wäre, wenn wahre Führung Loslassen bedeutet?"
    ]}
  },

  // ─────────────────────────────────────────
  // KELCHE
  // ─────────────────────────────────────────

  "C01": { // Ass der Kelche
    sanft: { de: [
      "Was öffnet dein Herz heute?",
      "Wo kannst du heute mit Mitgefühl begegnen?",
      "Was darf fließen?"
    ]},
    tief: { de: [
      "Was blockiert deinen emotionalen Ausdruck?",
      "Welches Gefühl wartet darauf, zugelassen zu werden?",
      "Wo hast du dein Herz verschlossen?"
    ]},
    existenziell: { de: [
      "Was bedeutet es, vollständig zu lieben?",
      "Was wäre, wenn du dein Herz weit öffnetest?",
      "Was fließt durch dich, wenn du dich nicht wehrst?"
    ]}
  },

  "C02": { // Zwei der Kelche
    sanft: { de: [
      "Welche Verbindung nährt dich gerade?",
      "Was schenkst du heute jemandem – mit Herz?",
      "Wo begegnest du jemandem auf Augenhöhe?"
    ]},
    tief: { de: [
      "Was hältst du in einer Beziehung zurück?",
      "Wo gibst du, ohne dich selbst zu sehen?",
      "Was brauchst du in Verbindung, das du nicht ausdrückst?"
    ]},
    existenziell: { de: [
      "Was bedeutet echte Verbindung für dich?",
      "Wer sieht dich wirklich – und lässt du es zu?",
      "Was wäre, wenn Liebe keine Gegenleistung braucht?"
    ]}
  },

  "C03": { // Drei der Kelche
    sanft: { de: [
      "Mit wem möchtest du heute Freude teilen?",
      "Was darf gefeiert werden – gemeinsam?",
      "Wo kannst du dich heute verbunden fühlen?"
    ]},
    tief: { de: [
      "Wo vermeidest du echte Gemeinschaft?",
      "Was hält dich davon ab, dich zu zeigen?",
      "Welche Freundschaft vernachlässigst du?"
    ]},
    existenziell: { de: [
      "Was bedeutet Zugehörigkeit für dich?",
      "Was wäre dein Leben ohne Gemeinschaft?",
      "Was gibst du in die Welt, wenn du wirklich Teil von ihr bist?"
    ]}
  },

  "C04": { // Vier der Kelche
    sanft: { de: [
      "Was bietet sich dir an, das du vielleicht übersiehst?",
      "Wo darfst du heute innehalten und neu bewerten?",
      "Was ist genug – gerade jetzt?"
    ]},
    tief: { de: [
      "Womit bist du unzufrieden – und warum?",
      "Was nimmst du als selbstverständlich hin?",
      "Wo bist du gelangweilt von deinem eigenen Leben?"
    ]},
    existenziell: { de: [
      "Was wäre, wenn das Angebotene ausreicht?",
      "Was suchst du, das bereits da ist?",
      "Was bedeutet Dankbarkeit jenseits von Worten?"
    ]}
  },

  "C05": { // Fünf der Kelche
    sanft: { de: [
      "Was trauert in dir gerade – und darf es?",
      "Welcher Verlust darf heute betrauert werden?",
      "Was bleibt noch, auch nach dem Schmerz?"
    ]},
    tief: { de: [
      "Was weinst du, das du noch nicht weinst?",
      "Wo hältst du dich im Schmerz fest?",
      "Was siehst du nicht, weil du auf das Verlorene starrst?"
    ]},
    existenziell: { de: [
      "Was hat Verlust dich gelehrt?",
      "Was wäre, wenn Trauer ein Weg zur Tiefe ist?",
      "Was bleibt von Liebe, wenn sie geht?"
    ]}
  },

  "C06": { // Sechs der Kelche
    sanft: { de: [
      "Welche schöne Erinnerung trägt dich heute?",
      "Was aus deiner Vergangenheit gibt dir Wärme?",
      "Wem kannst du heute etwas Schönes schenken?"
    ]},
    tief: { de: [
      "Was hält dich in der Vergangenheit gefangen?",
      "Welche Nostalgie verhindert dein Jetzt?",
      "Was idealisierst du an früher, das so nie war?"
    ]},
    existenziell: { de: [
      "Was trägst du aus deiner Kindheit, das noch heilt?",
      "Wer warst du, bevor die Welt dich prägte?",
      "Was wäre, wenn Unschuld wiederherstellbar ist?"
    ]}
  },

  "C07": { // Sieben der Kelche
    sanft: { de: [
      "Welcher Traum darf heute Raum einnehmen?",
      "Was fasziniert dich gerade?",
      "Welche Möglichkeit klingt am stimmigsten?"
    ]},
    tief: { de: [
      "Worin verlierst du dich in Illusionen?",
      "Was wünschst du dir – und meidest die Wahrheit dahinter?",
      "Welche Wahl vermeidest du durch Träumen?"
    ]},
    existenziell: { de: [
      "Was ist der Unterschied zwischen deinem Traum und deiner Wahrheit?",
      "Was wäre, wenn du nur einen Wunsch wählen dürftest?",
      "Wohin führt deine Vorstellungskraft, wenn sie frei ist?"
    ]}
  },

  "C08": { // Acht der Kelche
    sanft: { de: [
      "Was darfst du heute hinter dir lassen?",
      "Wo fühlt sich ein Aufbruch richtig an?",
      "Was hat sich erfüllt – und braucht keinen Abschluss mehr?"
    ]},
    tief: { de: [
      "Was verlässt du – und traust dich nicht zuzugeben, warum?",
      "Was suchst du, das du nicht mehr dort findest?",
      "Wo gehst du weg, ohne wirklich gegangen zu sein?"
    ]},
    existenziell: { de: [
      "Was suchst du jenseits dessen, was du kennst?",
      "Was wäre, wenn Aufbruch die tiefste Form von Treue zu dir ist?",
      "Was liegt hinter dem Horizont, den du dir nicht erlaubst?"
    ]}
  },

  "C09": { // Neun der Kelche
    sanft: { de: [
      "Was wünschst du dir – und erlaubst es dir?",
      "Was macht dich heute zufrieden?",
      "Welcher Wunsch darf erfüllt werden?"
    ]},
    tief: { de: [
      "Was hast du erreicht – und fühlst dich trotzdem leer?",
      "Wo verwechselst du Wünsche mit Bedürfnissen?",
      "Was wünschst du dir wirklich – tief, jenseits des Offensichtlichen?"
    ]},
    existenziell: { de: [
      "Was bedeutet Erfüllung für dich – wirklich?",
      "Was wäre, wenn du bereits bekommst, was du brauchst?",
      "Was liegt jenseits aller Wünsche?"
    ]}
  },

  "C10": { // Zehn der Kelche
    sanft: { de: [
      "Was macht dein Leben gerade reich?",
      "Welche Beziehung trägt dich?",
      "Was fühlst du, wenn du an Glück denkst?"
    ]},
    tief: { de: [
      "Was hindert dich, dich wirklich glücklich zu fühlen?",
      "Wo setzt du Glück von Bedingungen abhängig?",
      "Was fehlt dir noch – und was, wenn gar nichts fehlt?"
    ]},
    existenziell: { de: [
      "Was bedeutet ein erfülltes Leben für dich?",
      "Was wäre, wenn du bereits vollständig bist?",
      "Wofür ist dein Herz dankbar, auch ohne Worte?"
    ]}
  },

  "C11": { // Bube der Kelche
    sanft: { de: [
      "Welche kreative Botschaft trägt dich heute?",
      "Was möchtest du ausdrücken – mit Herz?",
      "Welchem Gefühl darfst du heute folgen?"
    ]},
    tief: { de: [
      "Was träumst du, das du nicht lebst?",
      "Wo verdrängst du deine Empfindsamkeit?",
      "Was wäre, wenn du deine Gefühle nicht rechtfertigen müsstest?"
    ]},
    existenziell: { de: [
      "Was will durch dich ausgedrückt werden?",
      "Wer bist du, wenn du vollkommen fühlst?",
      "Was wäre, wenn Empfindsamkeit deine Stärke ist?"
    ]}
  },

  "C12": { // Ritter der Kelche
    sanft: { de: [
      "Wem kannst du heute Mitgefühl zeigen?",
      "Was trägt dich romantisch und zärtlich voran?",
      "Welchem Ruf des Herzens folgst du?"
    ]},
    tief: { de: [
      "Wo bist du romantisch – und verlierst dich dabei?",
      "Was idealisierst du in anderen, das du in dir suchst?",
      "Wo sind deine Gefühle Wunschdenken?"
    ]},
    existenziell: { de: [
      "Was ist die Reise deines Herzens?",
      "Wohin folgt dein Mitgefühl – und was kostet das?",
      "Was wäre, wenn Liebe kein Ziel ist, sondern ein Weg?"
    ]}
  },

  "C13": { // Königin der Kelche
    sanft: { de: [
      "Wem kannst du heute zuhören – wirklich?",
      "Was fühlt sich intuitiv richtig an?",
      "Wo kannst du heute mitfühlend sein – auch dir selbst gegenüber?"
    ]},
    tief: { de: [
      "Wo verlierst du dich in den Gefühlen anderer?",
      "Was nimmst du auf dich, das dir nicht gehört?",
      "Wo grenzt du dich nicht ab, weil du nicht verletzen willst?"
    ]},
    existenziell: { de: [
      "Was ist die tiefste Form von Mitgefühl für dich?",
      "Wie hältst du Fühlen und Sein in Balance?",
      "Was wäre, wenn du der Ozean bist – nicht die Wellen?"
    ]}
  },

  "C14": { // König der Kelche
    sanft: { de: [
      "Wie kannst du heute emotional reif begegnen?",
      "Was hältst du mit Würde und Wärme?",
      "Wo kannst du Fühlen und Handeln verbinden?"
    ]},
    tief: { de: [
      "Was unterdrückst du in dir, um stark zu wirken?",
      "Wo trägst du die Emotionen anderer, statt deine eigenen?",
      "Was kostet dich deine emotionale Kontrolle?"
    ]},
    existenziell: { de: [
      "Was bedeutet emotionale Reife für dich?",
      "Was wäre, wenn Fühlen und Führen dasselbe sind?",
      "Was trägst du in dir, das die Welt braucht?"
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

export function getRandomQuestion(
  cardId: string,
  depth: "sanft" | "tief" | "existenziell",
  locale: string
): string | null {
  const lang = locale.split("-")[0];
  const list = QUESTIONS[cardId]?.[depth]?.[lang];
  if (!list || list.length === 0) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}