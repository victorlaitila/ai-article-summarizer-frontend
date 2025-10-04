import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { Sparkles } from 'lucide-react';

interface GeneratorButtonProps {
  handleGenerate: () => void;
  isGenerating: boolean;
  url: string;
  summaryMode: string;
}

export default function GeneratorButton({handleGenerate, isGenerating, url, summaryMode}: GeneratorButtonProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !url || !summaryMode}
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
  )
}