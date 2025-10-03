import { useTranslation } from "react-i18next";
import Gradient from "./Gradient";
import LanguageSelector from "./LanguageSelector";

export default function AppHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-card/80">
      <div className="mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gradient />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-1.5">
              {t("summary")}
              <span className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg px-1 py-0.25 shadow font-bold">
                {t("ai")}
              </span>
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  )
}