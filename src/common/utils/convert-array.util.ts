export function splitParagraphIntoArray(paragraph: string): string[] {
  const sentences = paragraph.split(/\.|\n/);
  return sentences.map((sentence) => sentence.trim());
}
