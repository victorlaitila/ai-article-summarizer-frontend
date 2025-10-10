import { useState } from "react";
import { toast } from "sonner";
import { extractKeywords } from "../utils/keywords";
import MOCK_ARTICLES from "../mockArticles.json";
import type { SourceType, SummaryMode } from "../types";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const API_URL = import.meta.env.VITE_API_URL;

interface FetchResult {
  article_text: string;
  summary: string;
}

interface UseContentHandlerProps {
  summaryMode: SummaryMode;
  clearKeywords: () => void;
  setGeneratedKeywords: (keywords: string[]) => void;
}

export function useContentHandler({
  summaryMode,
  clearKeywords,
  setGeneratedKeywords,
}: UseContentHandlerProps) {
  const [lastInputHash, setLastInputHash] = useState<string>("");

  // Generate a unique hash combining source type, content, and summary mode
  const generateInputHash = (type: "url" | "text" | "file", value: string, mode: string) => {
    return `${type}:${mode}:${value.trim().slice(0, 100)}`;
  }
    
  // Fetch from live API
  const fetchArticle = async (payload: any): Promise<FetchResult> => {
    const response = await fetch(`${API_URL}/summarize-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return { article_text: data.article_text || "", summary: data.summary || "" };
  };

  // Handle file upload to backend
  const fetchFileSummary = async (file: File): Promise<FetchResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", summaryMode);

    const response = await fetch(`${API_URL}/summarize-file`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return { article_text: data.article_text || "", summary: data.summary || "" };
  };

  // Mock fetching
  const fetchMockArticle = (): Promise<{ article_text: string; summary: string }> => {
    return new Promise((resolve) => {
      const mockDelay = Math.random() * 2000 + 1000; // 2-3 seconds
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * MOCK_ARTICLES.length);
        const mockArticle = MOCK_ARTICLES[randomIndex];
        const mockSummary = mockArticle.summaries?.[summaryMode];
        resolve({
          article_text: mockArticle.article_text,
          summary: mockSummary,
        });
      }, mockDelay);
    });
  };

  // Unified generation handler for all input types
  const handleGenerate = async (type: SourceType, value: string, file?: File) => {
    const currentHash = generateInputHash(type, value, summaryMode);

    // Prevent duplicate submission of same content + same mode
    if (currentHash === lastInputHash) {
      toast.error("Please modify the content or mode to regenerate.");
      return null;
    }

    try {
      let result: FetchResult;
      if (USE_MOCK_API) {
        result = await fetchMockArticle();
      } else {
        if (type === "file" && file) {
          result = await fetchFileSummary(file);
        } else {
          result = await fetchArticle({ type, value, mode: summaryMode });
        }
      }

      clearKeywords();
      const keywords = extractKeywords(result.article_text, 5);
      setGeneratedKeywords(keywords);
      setLastInputHash(currentHash);
      return result;
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch summary.");
      setLastInputHash(currentHash);
      return null;
    }
  };

  return { handleGenerate };
}
