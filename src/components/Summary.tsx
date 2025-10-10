import { Trans, useTranslation } from "react-i18next";
import { CardContent } from "./ui/Card";
import TextToSpeechButton from "./TextToSpeechButton";
import { detectBCPLang } from "../utils/language";
import { formatText } from "../utils/keywords";
import { useKeywords } from "../contexts/KeywordContext";

interface SummaryProps {
  summary: string;
  fullArticle: string;
  showArticle: boolean;
  setShowArticle: (show: boolean) => void;
}

const keywordButtonStyles = [
  { bg: "bg-yellow-200", hoverBg: "hover:bg-yellow-300", text: "text-yellow-900", ring: "ring-yellow-400", ringRgb: "246,224,94" },
  { bg: "bg-green-200",  hoverBg: "hover:bg-green-300",  text: "text-green-900",  ring: "ring-green-400",  ringRgb: "104,211,145" },
  { bg: "bg-pink-200",   hoverBg: "hover:bg-pink-300",   text: "text-pink-900",   ring: "ring-pink-400",   ringRgb: "244,114,182" },
  { bg: "bg-orange-200", hoverBg: "hover:bg-orange-300", text: "text-orange-900", ring: "ring-orange-400", ringRgb: "251,146,60" },
  { bg: "bg-purple-200", hoverBg: "hover:bg-purple-300", text: "text-purple-900", ring: "ring-purple-400", ringRgb: "159,122,234" },
];

export default function Summary({summary, showArticle, setShowArticle}: SummaryProps) {
  const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
  const bcpLang = detectBCPLang(summary);

  const { generatedKeywords, selectedKeywords, toggleKeyword } = useKeywords();
  const { t } = useTranslation();

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
          {formatText(summary)}
          <TextToSpeechButton text={summary} lang={bcpLang} />
        </div>

        {/* Extracted keywords */}
        {generatedKeywords.length > 0 && (<div className="flex flex-wrap gap-2 mt-5 mb-1">
          {generatedKeywords.map((word, index) => {
            const style = keywordButtonStyles[index % keywordButtonStyles.length];
            const isActive = selectedKeywords.includes(word);
            return (
              <button
                key={word}
                onClick={() => toggleKeyword(word)}
                className={[
                  style.bg,
                  style.text,
                  style.hoverBg,
                  "px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:shadow-md",
                  isActive && `ring-2 ring-offset-1 ${style.ring}`
                ].join(" ")}
              >
                {word}
              </button>
            );
          })}
        </div>)}
      </div>
      <button
        onClick={() => setShowArticle(!showArticle)}
        className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
      >
        {showArticle ? t("hideFullArticle") : t("showFullArticle")}
      </button>
    </CardContent>
  );
}
