import type { FormEvent } from "react";

interface InputFormProps {
  url: string;
  setUrl: (url: string) => void;
  mode: string;
  setMode: (mode: string) => void;
  handleSubmit: (e: FormEvent) => void;
  loading: boolean;
}

export default function InputForm({
  url,
  setUrl,
  mode,
  setMode,
  handleSubmit,
  loading,
}: InputFormProps) {
  return (
    <form id="url-form" onSubmit={handleSubmit} className="space-y-6">
      {/* URL input with label */}
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Paste an article URL to summarize:
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
            focus:border-blue-300 focus:ring-2 focus:ring-blue-500 
            focus:outline-none transition"
          required
        />
      </div>

      {/* Summary mode select with label */}
      <div>
        <label
          htmlFor="mode"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Choose how you want the article summarized:
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
            focus:outline-none text-gray-700 shadow-sm transition"
        >
          <option value="default">Default</option>
          <option value="bullets">Bullet Points</option>
          <option value="simple">Simplified</option>
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
        {loading ? "Summarizing..." : "Summarize Article"}
      </button>
    </form>
  );
}
