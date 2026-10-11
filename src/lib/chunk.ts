import type { ExtractedPage } from "@/lib/extract";

// Grobe Faustregel: 1 Token ≈ 4 Zeichen. So bleiben wir ohne Tokenizer bei ca. 750 Tokens pro Chunk.
const CHUNK_SIZE = 3000;
// Überlappung (ca. 100 Tokens), damit Sätze an der Grenze in beiden Chunks stehen
const OVERLAP = 400;
// Schnittpunkte nach Priorität: Absatz, Zeilenumbruch, Satzende, Leerzeichen
const BREAKS = ["\n\n", "\n", ". ", " "];

export type Chunk = {
  chunk_index: number;
  page: number | null;
  content: string;
};

// Sucht den besten Schnittpunkt in der zweiten Hälfte des Fensters, damit Chunks nicht zu klein werden
function findEnd(text: string, start: number): number {
  const hardEnd = start + CHUNK_SIZE;
  if (hardEnd >= text.length) return text.length;

  const window = text.slice(start, hardEnd);
  for (const sep of BREAKS) {
    const idx = window.lastIndexOf(sep);
    if (idx > CHUNK_SIZE / 2) return start + idx + sep.length;
  }
  return hardEnd;
}

// Nächster Chunk beginnt OVERLAP Zeichen vor dem Ende, aber nie mitten in einem Wort
function nextStart(text: string, start: number, end: number): number {
  const candidate = Math.max(end - OVERLAP, start + 1);
  const nextSpace = text.indexOf(" ", candidate);
  return nextSpace === -1 || nextSpace >= end ? candidate : nextSpace + 1;
}

function splitText(text: string): string[] {
  const parts: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = findEnd(text, start);
    parts.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = nextStart(text, start, end);
  }

  return parts.filter((part) => part.length > 0);
}

export function chunkPages(pages: ExtractedPage[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const { page, text } of pages) {
    for (const content of splitText(text)) {
      chunks.push({ chunk_index: chunks.length, page, content });
    }
  }

  return chunks;
}
