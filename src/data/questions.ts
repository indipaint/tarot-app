export type Depth = "sanft" | "tief" | "existenziell";

export const QUESTIONS: Record<
  string,
  {
    sanft: Record<string, string[]>;
    tief: Record<string, string[]>;
    existenziell: Record<string, string[]>;
  }
> = {

  "01": {
    sanft: {
      de: [
        "Wo darfst du heute milder mit dir sein?",
        "Was braucht gerade Geduld statt Druck?",
        "Welche kleine Bewegung fühlt sich richtig an?"
      ]
    },
    tief: {
      de: [
        "Was vermeidest du wirklich zu fühlen?",
        "Wo sabotierst du dich selbst?",
        "Was würde sich verändern, wenn du ehrlich wärst?"
      ]
    },
    existenziell: {
      de: [
        "Wer wärst du ohne deine Angst?",
        "Was in dir will geboren werden?",
        "Welche Wahrheit traust du dich nicht auszusprechen?"
      ]
    }
  }

};
export function getRandomQuestion(
  cardId: number,
  depth: "sanft" | "tief" | "existenziell",
  locale: string
): string | null {
  const lang = locale.split("-")[0];
  const list = QUESTIONS[cardId]?.[depth]?.[lang];

  if (!list || list.length === 0) return null;

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}