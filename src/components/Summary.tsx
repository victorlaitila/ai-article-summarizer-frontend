import { Trans } from "react-i18next";
import { CardContent } from "./ui/Card";

interface SummaryProps {
  summary: string;
  showArticle: boolean;
  setShowArticle: (show: boolean) => void;
}

export default function Summary({summary, showArticle, setShowArticle}: SummaryProps) {
  const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

  return (
    <CardContent>
      <div className="bg-indigo-50 rounded-lg p-2.5 mt-1 whitespace-pre-wrap">
        {/* Disclaimer text for when application is used with mock server */}
        {USE_MOCK_API && (
          <>
            <Trans
              i18nKey="mockSummary"
              components={[
                <a
                  key="projectLink"
                  href="https://github.com/victorlaitila/ai-article-summarizer-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                />,
              ]}
            />
            <div className="w-35/36 my-2 mx-auto h-px bg-gray-300" />
          </>
        )}
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