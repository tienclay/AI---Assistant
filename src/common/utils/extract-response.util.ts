export function extractLastParagraph(text: string): string {
  const paragraphs = text.split('\n\n'); // Split the text into paragraphs using double newline as the delimiter
  const lastParagraph = paragraphs[paragraphs.length - 1].trim(); // Get the last paragraph and trim any leading or trailing whitespace
  return lastParagraph;
}

export function removePatternFromResponse(response: string): string {
  // Regular expression to match the pattern " - Running: {dynamic part}\n\n"
  const pattern = /\n - Running: .*\n\n/;

  // Check if the pattern exists in the response
  if (pattern.test(response)) {
    // Remove the pattern from the response
    response = response.replace(pattern, '');
  }

  return response;
}
