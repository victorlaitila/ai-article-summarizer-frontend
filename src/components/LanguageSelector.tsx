import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import type { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { GlobeIcon } from 'lucide-react';

const languageNames = {
  en: '🇺🇸 English',
  sv: '🇸🇪 Svenska',
  fi: '🇫🇮 Suomi',
};

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
        <SelectTrigger className="border-0 w-30 max-[500px]:w-15 max-[500px]:h-10">
          {/* Normal select component for wide screens */}
          <span className="max-[500px]:hidden">
            <SelectValue />
          </span>
          {/* Globe icon for narrow screens */}
          <span className="hidden max-[500px]:flex">
            <GlobeIcon className="w-4 h-4" />
          </span>
        </SelectTrigger>
        <SelectContent widthClass="w-30">
          {Object.entries(languageNames).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}