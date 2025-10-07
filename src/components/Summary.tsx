import { Trans, useTranslation } from "react-i18next";
import { CardContent } from "./ui/Card";
import TextToSpeechButton from "./TextToSpeechButton";
import { detectBCPLang } from "../utils/language";
import { extractKeywords } from "../utils/keywords";

interface SummaryProps {
  summary: string;
  fullArticle: string;
  showArticle: boolean;
  setShowArticle: (show: boolean) => void;
}

export default function Summary({summary, fullArticle, showArticle, setShowArticle}: SummaryProps) {
  const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
  const bcpLang = detectBCPLang(summary);

  const { t } = useTranslation();

  const keywords = extractKeywords(fullArticle, 5);

  return (
    <CardContent>
      <div className="bg-indigo-50 rounded-lg p-2.5 mt-1 whitespace-pre-wrap">
        {/* Disclaimer text for when application is used with mock server */}
        {USE_MOCK_API && (
          <>
            <Trans
              i18nKey="mockSummary"
              components={{
                projectLink: (
                  <a
                    href="https://github.com/victorlaitila/ai-article-summarizer-backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  />
                ),
              }}
            />
            <div className="w-35/36 my-2 mx-auto h-px bg-gray-300" />
          </>
        )}
        <div>
          {summary}
          <TextToSpeechButton text={summary} lang={bcpLang} />
        </div>

        {/* Extracted keywords */}
        <div className="flex flex-wrap gap-2 mt-5">
          {keywords.map((word) => (
            <button
              key={word}
              className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full cursor-pointer"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setShowArticle(!showArticle)}
        className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
      >
        {showArticle ? t("hideFullArticle") : t("showFullArticle")}
      </button>
    </CardContent>
  )
}