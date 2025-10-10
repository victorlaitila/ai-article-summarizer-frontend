import nlp from 'compromise';

const stopWords = new Set([
  'article', 'summary', 'read', 'click', 'page', 'text', 'they', 'them', 'he', 'she', 'it',
  'this', 'that', 'these', 'those', 'have', 'has', 'been', 'was', 'were', 'is', 'are',
  'a', 'an', 'the', 'of', 'and', 'in', 'on', 'for', 'with', 'to', 'as', 'by', 'at', 'from',
  'could', 'would', 'can', 'may', 'show', 'say', 'says', 'new', 'early', 'major', 'significant'
]);

/**
 * Extracts the most frequent keywords (nouns) from the given text.
 * 
 * @param text - The input text from which to extract keywords.
 * @param maxKeywords - The maximum number of keywords to return (default is 5).
 * @returns An array of the most frequent keywords found in the text, sorted by frequency.
 */
export function extractKeywords(text: string, maxKeywords = 5): string[] {
  const doc = nlp(text);
  const nouns: string[] = doc.nouns().out('array');

  const freqMap: Record<string, number> = {};
  nouns.forEach(word => {
    const w = word.toLowerCase().trim().replace(/[.,;!?]/g, ''); // remove punctuation & trim
    if (!stopWords.has(w) && w && !w.includes(' ')) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  // Sort by frequency
  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  return sorted.slice(0, maxKeywords);
}
