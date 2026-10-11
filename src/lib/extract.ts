import { extractText, getDocumentProxy } from "unpdf";

export type ExtractedPage = {
  // Seitenzahl für Zitate; bei reinem Text gibt es keine Seiten
  page: number | null;
  text: string;
};

export async function extractPages(
  data: ArrayBuffer,
  type: "pdf" | "text",
): Promise<ExtractedPage[]> {
  if (type === "text") {
    const text = new TextDecoder().decode(data).trim();
    return text ? [{ page: null, text }] : [];
  }

  const pdf = await getDocumentProxy(new Uint8Array(data));
  const { text } = await extractText(pdf, { mergePages: false });

  return text
    .map((pageText, index) => ({ page: index + 1, text: pageText.trim() }))
    .filter((p) => p.text.length > 0);
}
