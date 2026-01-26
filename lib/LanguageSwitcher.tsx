"use client";

import { useLanguage } from "./LanguageContext.js";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "mn" : "en")}
      className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
    >
      {language === "en" ? "Монгол" : "English"}
    </button>
  );
}
