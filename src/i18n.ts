import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      appName: 'SummaryAI',
      description: 'Enter an article URL and choose how you\'d like it summarized:',
      articleUrl: 'Article URL',
      urlPlaceholder: 'https://example.com/article',
      summaryMode: 'Summary Mode',
      chooseSummaryStyle: 'Choose summary style',
      shortSummary: 'Short Summary',
      detailedSummary: 'Detailed Summary',
      bulletPoints: 'Bullet Points',
      generateSummary: 'Generate Summary',
      generating: 'Generating...',
      generatedSummary: 'Generated Summary',
      readyToSummarize: 'Ready to Summarize',
      readyDescription: 'Enter an article URL above and select your preferred summary style to get started.',
      errorMessage: 'Please enter a URL and select a summary mode',
      successMessage: 'Summary generated successfully!',
      copiedMessage: 'Summary copied to clipboard!',
      downloadedMessage: 'Summary downloaded!',
      language: 'Language'
    },
  },
  sv: {
    translation: {
      description: 'Ange en artikel-URL och välj hur du vill att den ska sammanfattas:',
    }
  },
  fi: {
    translation: {
      description: 'Syötä artikkelin URL-osoite ja valitse, miten haluat sen tiivistettävän:',
    },
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
