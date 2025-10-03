import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Copy, Download, Share2, Sparkles } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './contexts/LanguageContext';
import AppHeader from './components/AppHeader';

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
            closeButton: 'toast-close-button', 
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
              <div className="space-y-2">
                <p className="font-medium text-sm leading-none">{t("articleUrl")}</p>
                <Input
                  id="url"
                  type="url"
                  placeholder={t("urlPlaceholder")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm leading-none">{t("summaryMode")}</p>
                <Select value={summaryMode} onValueChange={setSummaryMode}>
                  <SelectTrigger id="summary-mode" className="h-12">
                    <SelectValue placeholder={t("chooseSummaryStyle")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t("defaultSummary")}</SelectItem>
                    <SelectItem value="bullets">{t("bulletPointsSummary")}</SelectItem>
                    <SelectItem value="simple">{t("simplifiedSummary")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <div className="w-17/18 mx-auto h-px bg-gray-200" />
              <CardContent>
                <div className="bg-indigo-50 rounded-lg p-2.5 mt-1">
                  {summary}
                </div>
                <button
                  onClick={() => setShowArticle(!showArticle)}
                  className="text-blue-600 font-medium hover:underline mt-4 cursor-pointer"
                >
                  {showArticle ? "Hide full article" : "Show full article"}
                </button>
              </CardContent>
              {showArticle && (
                <CardContent>
                  <div className="bg-indigo-50 rounded-lg p-2.5">
                    {article}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Empty State */}
          {!summary && (
            <Card className="shadow-xl border-1 bg-gradient-to-br from-card to-accent/10">
              <CardContent className="mb-8 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t("readyToSummarize")}</h3>
                <p className="text-muted-foreground max-w-sm">
                  {t("readyDescription")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
