import { useState } from "react";
import type { FormEvent } from "react";
import ArticleSummary from "./ArticleSummary";
import Article from "./Article";
import ErrorMessage from "./ErrorMessage";
import InputForm from "./InputForm";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [lastSubmittedUrl, setLastSubmittedUrl] = useState<string>("");
  const [mode, setMode] = useState("default");
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Block submitting the same URL again
    if (url === lastSubmittedUrl) {
      setError("Please enter a new URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/scrape-and-summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode }),
      });

      const data: APIResponse = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setArticle(data.article_text || "");
        setSummary(data.summary || "");
      }
      
      setLastSubmittedUrl(url);
    } catch {
      setError("Failed to fetch API");
      setLastSubmittedUrl(url);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <InputForm 
        url={url} 
        setUrl={setUrl} 
        handleSubmit={handleSubmit} 
        loading={loading} 
        mode={mode}
        setMode={setMode}
      />
      {error && <ErrorMessage error={error} />}
      {summary && <ArticleSummary summary={summary} />}
      {article && <Article article={article} />}
    </div>
  );
}
