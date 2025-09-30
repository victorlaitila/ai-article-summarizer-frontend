import type { FormEvent } from "react";
import SubmitButton from "./SubmitButton";
import ModeSelect from "./ModeSelect";

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
        <p className="block text-sm font-semibold text-gray-700 mb-2">
          Paste an article URL to summarize:
        </p>
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

      <ModeSelect mode={mode} setMode={setMode} />


      {/* Summary mode select with label 
      <div>
        <p className="block text-sm font-semibold text-gray-700 mb-2">
          Choose how you want the article summarized:
        </p>
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
      </div>*/}

      {/* Submit button */}
      <SubmitButton loading={loading} />
    </form>
  );
}
