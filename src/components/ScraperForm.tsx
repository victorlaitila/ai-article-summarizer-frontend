import { useState } from "react";
import type { FormEvent } from "react";

interface URLInput {
  url: string;
}

interface APIResponse {
  article_text?: string;
  summary?: string;
  error?: string;
}

export default function ScraperForm() {
  const [url, setUrl] = useState<string>("");
  const [article, setArticle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showArticle, setShowArticle] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setArticle("");
    setSummary("");

    try {
      const response = await fetch("http://localhost:8000/scrape-and-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url } as URLInput),
      });

      const data: APIResponse = await response.json();

      if (data.error) setError(data.error);
      else {
        setArticle(data.article_text || "");
        setSummary(data.summary || "");
      }
    } catch {
      setError("Failed to fetch API");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          placeholder="🔗 Enter an article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Processing..." : "✨ Scrape & Summarize"}
        </button>
      </form>

      {loading && (
        <div className="mt-10 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
        </div>
      )}

      {error && (
        <p className="mt-6 text-red-600 font-semibold text-center">{error}</p>
      )}

      {/* Summary block */}
      {summary && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">📝 Summary</h2>
          <p className="bg-blue-50 p-5 rounded-lg shadow-inner whitespace-pre-wrap text-gray-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Toggle full article */}
      {article && (
        <div className="mt-6">
          <button
            onClick={() => setShowArticle(!showArticle)}
            className="text-blue-600 font-medium mb-2 hover:underline transition"
          >
            {showArticle ? "Hide full article" : "Show full article"}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              showArticle ? "max-h-[2000px]" : "max-h-0"
            }`}
          >
            <p className="bg-gray-50 p-5 rounded-lg shadow-inner whitespace-pre-wrap text-gray-700 leading-relaxed">
              {article}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
