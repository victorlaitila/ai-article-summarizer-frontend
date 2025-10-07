import nlp from 'compromise';
import { useKeywords } from '../contexts/KeywordContext';

const stopWords = new Set([
  'article', 'summary', 'read', 'click', 'page', 'text', 'they', 'them', 'he', 'she', 'it',
  'this', 'that', 'these', 'those', 'have', 'has', 'been', 'was', 'were', 'is', 'are',
  'a', 'an', 'the', 'of', 'and', 'in', 'on', 'for', 'with', 'to', 'as', 'by', 'at', 'from',
  'could', 'would', 'can', 'may', 'show', 'say', 'says', 'new', 'early', 'major', 'significant'
]);

const HIGHLIGHT_COLORS = [
  'bg-yellow-300',
  'bg-green-300',
  'bg-pink-300',
  'bg-orange-300',
  'bg-purple-300',
];

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

/**
 * Formats text by highlighting selected keywords in different colors.
 * 
 * @param text - The text to format and highlight keywords within.
 * @returns An array of strings and JSX <span> elements with highlighted keywords.
 */
export function formatText(text: string) {
  const { generatedKeywords, selectedKeywords } = useKeywords();

  if (selectedKeywords.length === 0) {
    return [text];
  }

  // Create a consistent map of keyword -> color based on generatedKeywords order
  const keywordColorMap: Record<string, string> = {};
  generatedKeywords.forEach((keyword, index) => {
    keywordColorMap[keyword.toLowerCase()] = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
  });

  // Split text and wrap selected keywords in spans
  const regex = new RegExp(
    `(${selectedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  const parts = text.split(regex);

  return parts.map((part, index) => {
    const lowerPart = part.toLowerCase();
    if (selectedKeywords.includes(lowerPart)) {
      const color = keywordColorMap[lowerPart];
      return (
        <span key={index} className={`${color} rounded px-0.5`}>
          {part}
        </span>
      );
    }
    return part;
  });
}