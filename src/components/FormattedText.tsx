import { useKeywords } from "../contexts/KeywordContext";

const HIGHLIGHT_COLORS = [
  "bg-yellow-300",
  "bg-green-300",
  "bg-pink-300",
  "bg-orange-300",
  "bg-purple-300",
];

/**
 * Formats text by highlighting selected keywords in different colors.
 */
export function FormattedText({text}: {text: string}) {
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

