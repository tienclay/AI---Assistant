export function extractLastParagraph(text: string): string {
  const paragraphs = text.split('\n\n'); // Split the text into paragraphs using double newline as the delimiter
  const lastParagraph = paragraphs[paragraphs.length - 1].trim(); // Get the last paragraph and trim any leading or trailing whitespace
  return lastParagraph;
}
