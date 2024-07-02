export function extractJSONObject(input: string): any {
  const jsonRegex = /```json([\s\S]*)```/;
  const matches = input.match(jsonRegex);

  if (matches && matches.length >= 2) {
    const jsonString = matches[1].trim();

    try {
      const jsonData = JSON.parse(jsonString);
      return jsonData;
    } catch (error) {
      console.error('Invalid JSON string:', error);
    }
  }

  return null;
}
