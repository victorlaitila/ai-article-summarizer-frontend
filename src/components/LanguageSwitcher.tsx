import { useState, useRef, useEffect } from "react";
import i18n from "i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "swe", name: "Svenska", flag: "🇸🇪" }
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const currentLanguage = languages.find((l) => l.code === i18n.language);

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 shadow hover:shadow-md transition cursor-pointer"
      >
        {currentLanguage?.flag || "🌐"}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-blue-100 transition cursor-pointer"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
