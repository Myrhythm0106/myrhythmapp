export interface ReadingTurn { speaker: string; text: string; start: number; end: number; unclear?: string[] }
export interface ReadingPassage { turnIndex: number; offset: number; text: string; turnStart: number; firstPart: boolean }
export const PASSAGES_PER_SECTION = 8;

/** Presentation slices only. Concatenating slices restores every original character. */
export function readingPassages(turns: ReadingTurn[]): ReadingPassage[] {
  const passages: ReadingPassage[] = [];
  let offset = 0;
  turns.forEach((turn, turnIndex) => {
    let start = 0;
    while (start < turn.text.length) {
      let end = Math.min(start + 700, turn.text.length);
      if (end < turn.text.length) {
        const space = turn.text.lastIndexOf(' ', end);
        if (space > start + 350) end = space + 1;
      }
      passages.push({ turnIndex, offset: offset + start, text: turn.text.slice(start, end), turnStart: start, firstPart: start === 0 });
      start = end;
    }
    offset += turn.text.length + 2;
  });
  return passages;
}