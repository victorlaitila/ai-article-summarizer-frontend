import { CardContent } from "./ui/Card";

interface SummaryProps {
  summary: string;
  showArticle: boolean;
  setShowArticle: (show: boolean) => void;
}

export default function Summary({summary, showArticle, setShowArticle}: SummaryProps) {
  return (
    <CardContent>
      <div className="bg-indigo-50 rounded-lg p-2.5 mt-1">
        {summary}
      </div>
      <button
        onClick={() => setShowArticle(!showArticle)}
        className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
      >
        {showArticle ? "Hide full article" : "Show full article"}
      </button>
    </CardContent>
  )
}