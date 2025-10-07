import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TextToSpeechButtonProps {
  text: string;
  lang?: string; // BCP 47 language code
}

export default function TextToSpeechButton({ text, lang = "en-US" }: TextToSpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`cursor-pointer relative top-[3px] left-2 rounded-full shadow-sm
        ${isSpeaking
          ? "bg-red-100 hover:bg-red-200 text-red-600"
          : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
        }`}
      title={isSpeaking ? "Stop" : "Listen"}
    >
      {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}