import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Sparkles } from "lucide-react";
import type { SourceType } from "../types";

interface GeneratorButtonProps {
  handleGenerate: () => void;
  isGenerating: boolean;
  sourceType: SourceType;
  url?: string;
  text?: string;
  file?: File | null;
  summaryMode: string;
}

export default function GeneratorButton({
  handleGenerate,
  isGenerating,
  sourceType,
  url,
  text,
  file,
  summaryMode,
}: GeneratorButtonProps) {
  const { t } = useTranslation();

  const hasValidInput =
    (sourceType === "url" && !!url?.trim()) ||
    (sourceType === "text" && !!text?.trim()) ||
    (sourceType === "file" && !!file);

  const isDisabled = isGenerating || !hasValidInput || !summaryMode;

  return (
    <div>
      <Button
        onClick={handleGenerate}
        disabled={isDisabled}
        className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            {t("generating")}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {t("generateSummary")}
          </>
        )}
      </Button>
    </div>
  );
}
