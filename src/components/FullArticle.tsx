import { formatText } from "../utils/keywords";
import { detectBCPLang } from "../utils/language";
import TextToSpeechButton from "./TextToSpeechButton";
import { CardContent } from "./ui/Card";

export default function FullArticle({article}: {article: string}) {
  const bcpLang = detectBCPLang(article);

  return (
    <CardContent>
      <div className="bg-indigo-50 rounded-lg p-2.5 whitespace-pre-wrap">
        <div>
          {formatText(article)}
          <TextToSpeechButton text={article} lang={bcpLang} />
        </div>
      </div>
    </CardContent>
  )
}