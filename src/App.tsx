import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Toaster, toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './contexts/LanguageContext';
import AppHeader from './components/AppHeader';
import ModeSelector from './components/ModeSelector';
import GeneratorButton from './components/GeneratorButton';
import UrlInput from './components/UrlInput';
import SummaryButtonGroup from './components/SummaryButtonGroup';
import SummaryPlaceholder from './components/SummaryPlaceholder';
import FullArticle from './components/FullArticle';
import Summary from './components/Summary';

const API_URL = import.meta.env.VITE_API_URL;

interface APIResponse {
  article_text?: string;
  summary?: string;
  error?: string;
}

export default function App() {
  const [url, setUrl] = useState<string>('');
  const [lastSubmittedUrl, setLastSubmittedUrl] = useState<string>('');
  const [summaryMode, setSummaryMode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showArticle, setShowArticle] = useState<boolean>(false);
  const [article, setArticle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  /* Since the backend is hosted on a free tier service that sleeps after inactivity,
  a wake-up call is sent when the frontend loads. */
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        console.log("Backend wake-up: ", response.status);
      } catch (err) {
        console.error("Backend wake-up failed", err);
      }
    };
    wakeBackend();
    changeLanguage(language, true); // No toast on initial load
  }, []);

  const handleGenerate = async () => {
    // Block submitting the same URL again
    if (url === lastSubmittedUrl && summary) {
      toast.error("Please enter a new URL.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_URL}/scrape-and-summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, summaryMode }),
      });

      const data: APIResponse = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setArticle(data.article_text || "");
        setSummary(data.summary || "");
      }
      
      setLastSubmittedUrl(url);
    } catch {
      toast.error("Failed to fetch API");
      setLastSubmittedUrl(url);
    }
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success(t("copiedMessage"));
  };

  const handleDownload = () => {
    {/*const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("downloadedMessage"));*/}
    console.log("download function called.")
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Article Summary',
        text: summary,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-background via-accent/20 to-background">
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            closeButton: "toast-close-button", 
          },
          style: { fontSize: "1rem", width: "max-content", maxWidth: "50vw", paddingRight: "36px" },
          duration: 3000,
        }}
      />

      <AppHeader />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">

          {/* Input Section */}
          <Card className="shadow-xl border-1 bg-gradient-to-br from-card to-accent/10">
            <CardHeader>
              <p className="font-medium text-sm leading-none">{t("description")}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <UrlInput url={url} setUrl={setUrl} />
              <ModeSelector summaryMode={summaryMode} setSummaryMode={setSummaryMode} />
              <GeneratorButton 
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
                url={url}
                summaryMode={summaryMode} 
              />
            </CardContent>
          </Card>

          {/* Output Section */}
          {summary && (
            <Card className="gap-3 shadow-xl bg-gradient-to-br from-card to-purple-50/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-medium relative top-0.5">
                    {t("generatedSummary")}
                  </CardTitle>
                  <SummaryButtonGroup 
                    handleCopy={handleCopy}
                    handleDownload={handleDownload}
                    handleShare={handleShare}
                  />
                </div>
              </CardHeader>
              <div className="w-17/18 mx-auto h-px bg-gray-200" />
              <Summary
                summary={summary}
                showArticle={showArticle}
                setShowArticle={setShowArticle}
              />
              {showArticle && (<FullArticle article={article} />)}
            </Card>
          )}

          {/* Empty State */}
          {!summary && (<SummaryPlaceholder />)}
        </div>
      </main>
    </div>
  );
}
