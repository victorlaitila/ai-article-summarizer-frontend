import { useState, useCallback, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);

  const speak = useCallback((text: string, lang = "en-US") => {
    if (!text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveText(text);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveText(null);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveText(null);
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { isSpeaking, activeText, speak, stop };
}
