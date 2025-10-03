import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const languageNames = {
  en: '🇺🇸 English',
  sv: '🇸🇪 Svenska',
  fi: '🇫🇮 Suomi',
};

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return(
    <div>
      <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
        <SelectTrigger className="w-40 border-0">
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
  )
}