"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "mn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    search: "Search",
    donate: "Donate",
    fundraise: "Fundraise",
    about: "About",
    signIn: "Sign in",
    startGoFundMe: "Start a Fundify",
    searchFundraisers: "Search Fundraisers",
    findFundraisers: "Find fundraisers by title, description, or category",
    searchPlaceholder: "Search fundraisers...",
    loading: "Loading fundraisers...",
    noMatches: "No fundraisers match your search.",
    noFundraisers: "No fundraisers available yet.",
    startYourOwn: "Start Your Own Fundraiser",
    raised: "Raised",
    donateNow: "Donate Now",
  },
  mn: {
    search: "Хайх",
    donate: "Хандивлах",
    fundraise: "Сан хөдөлгөх",
    about: "Тухай",
    signIn: "Нэвтрэх",
    startGoFundMe: "GoFundMe эхлүүлэх",
    searchFundraisers: "Сан хөдөлгөөг хайх",
    findFundraisers: "Гарчиг, тайлбар эсвэл ангиллаар сан хөдөлгөөг олох",
    searchPlaceholder: "Сан хөдөлгөөг хайх...",
    loading: "Сан хөдөлгөөг ачааллаж байна...",
    noMatches: "Таны хайлттай тохирох сан хөдөлгөө алга.",
    noFundraisers: "Одоогоор сан хөдөлгөөг алга.",
    startYourOwn: "Өөрийн сан хөдөлгөөг эхлүүлэх",
    raised: "Цугласан",
    donateNow: "Одоо хандивлах",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("mn");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "mn")) {
      setLanguageState(savedLanguage);
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) =>
    translations[language][key as keyof typeof translations.en] ?? key;

  if (!isHydrated) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
