import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Copy, Download, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const API_URL = import.meta.env.VITE_API_URL;

interface APIResponse {
  article_text?: string;
  summary?: string;
  error?: string;
}

type Language = 'en' | 'sv' | 'fi';

const languageNames = {
  en: '🇺🇸 English',
  sv: '🇸🇪 Svenska',
  fi: '🇫🇮 Suomi',
};

export default function App() {
  const [url, setUrl] = useState('');
  const [lastSubmittedUrl, setLastSubmittedUrl] = useState<string>("");
  const [summaryMode, setSummaryMode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  const { t } = useTranslation();

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
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  const handleGenerate = async () => {
    // Block submitting the same URL again
    if (url === lastSubmittedUrl) {
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
    //navigator.clipboard.writeText(summary);
    //toast.success(t("copiedMessage"));
    console.log("copy function called.")
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
    {/*if (navigator.share) {
      navigator.share({
        title: 'Article Summary',
        text: summary,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
    }*/}
    console.log("share function called.")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{t("appName")}</h1>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
                <SelectTrigger className="w-40 h-10 border-0 bg-transparent hover:bg-accent/50 focus:ring-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageNames).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Input Section */}
          <Card className="shadow-xl border-1 bg-gradient-to-br from-card to-accent/10">
            <CardHeader>
              <Label>{t("description")}</Label>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">{t("articleUrl")}</Label>
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
                <Label htmlFor="summary-mode">{t("summaryMode")}</Label>
                <Select value={summaryMode} onValueChange={setSummaryMode}>
                  <SelectTrigger id="summary-mode" className="h-12">
                    <SelectValue placeholder={t("chooseSummaryStyle")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">{t("shortSummary")}</SelectItem>
                    <SelectItem value="detailed">{t("detailedSummary")}</SelectItem>
                    <SelectItem value="bullets">{t("bulletPoints")}</SelectItem>
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
            <Card className="shadow-xl border-0 bg-gradient-to-br from-card to-purple-50/30 dark:to-purple-900/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    {t("generatedSummary")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
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
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
                  {summary}
                </div>
              </CardContent>
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
