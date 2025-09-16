import { useState } from "react";

interface ArticleProps {
  article: string;
}

export default function Article({ article }: ArticleProps) {
  const [showArticle, setShowArticle] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowArticle(!showArticle)}
        className="text-blue-600 font-medium mb-2 hover:underline cursor-pointer"
      >
        {showArticle ? "Hide full article" : "Show full article"}
      </button>

      <div
        className={`overflow-hidden ${
          showArticle ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <p className="bg-gray-50 p-5 rounded-lg shadow-inner whitespace-pre-wrap text-gray-700 leading-relaxed">
          {article}
        </p>
      </div>
    </div>
  )
}