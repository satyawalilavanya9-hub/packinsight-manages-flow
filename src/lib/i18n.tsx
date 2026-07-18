import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const DICT = {
  en: {
    "greeting.morning": "Good morning",
    "greeting.afternoon": "Good afternoon",
    "greeting.evening": "Good evening",
    "greeting.priorities": "Your priorities today",
    "greeting.subtitle": "AI-picked focus for the shift",
    "nav.dashboard": "Dashboard",
    "search.placeholder": "Search orders, SKUs, customers…",
    "predictive.title": "Predictive Maintenance",
    "predictive.subtitle": "AI-flagged risk based on OEE & downtime trend",
    "predictive.risk.high": "High risk",
    "predictive.risk.medium": "Medium risk",
    "predictive.risk.low": "Low risk",
    "predictive.action": "Schedule inspection",
    "calc.preview": "Live 3D box preview",
    "voice.listen": "Speak your question",
    "voice.listening": "Listening…",
    "lang.label": "Language",
  },
  hi: {
    "greeting.morning": "सुप्रभात",
    "greeting.afternoon": "नमस्ते",
    "greeting.evening": "शुभ संध्या",
    "greeting.priorities": "आज की प्राथमिकताएँ",
    "greeting.subtitle": "शिफ्ट के लिए AI-चयनित फोकस",
    "nav.dashboard": "डैशबोर्ड",
    "search.placeholder": "ऑर्डर, SKU, ग्राहक खोजें…",
    "predictive.title": "पूर्वानुमानित रखरखाव",
    "predictive.subtitle": "OEE और डाउनटाइम रुझान के आधार पर AI जोखिम",
    "predictive.risk.high": "उच्च जोखिम",
    "predictive.risk.medium": "मध्यम जोखिम",
    "predictive.risk.low": "कम जोखिम",
    "predictive.action": "निरीक्षण शेड्यूल करें",
    "calc.preview": "लाइव 3D बॉक्स पूर्वावलोकन",
    "voice.listen": "अपना प्रश्न बोलें",
    "voice.listening": "सुन रहा है…",
    "lang.label": "भाषा",
  },
} as const;

type Key = keyof typeof DICT.en;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("packinsight.lang") as Lang | null)) || "en";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("packinsight.lang", l);
  };

  const t = (k: Key) => DICT[lang][k] ?? DICT.en[k] ?? k;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
