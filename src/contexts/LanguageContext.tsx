import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "ta" | "bn";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
    bn: string;
  };
}

// Core translations for the application
export const translations: Translations = {
  // Navigation
  "nav.dashboard": {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    ta: "டாஷ்போர்டு",
    bn: "ড্যাশবোর্ড",
  },
  "nav.inbox": {
    en: "Inbox",
    hi: "इनबॉक्स",
    ta: "இன்பாக்ஸ்",
    bn: "ইনবক্স",
  },
  "nav.contacts": {
    en: "Contacts",
    hi: "संपर्क",
    ta: "தொடர்புகள்",
    bn: "পরিচিতি",
  },
  "nav.campaigns": {
    en: "Campaigns",
    hi: "अभियान",
    ta: "பிரச்சாரங்கள்",
    bn: "প্রচারণা",
  },
  "nav.templates": {
    en: "Templates",
    hi: "टेम्पलेट्स",
    ta: "வார்ப்புருக்கள்",
    bn: "টেমপ্লেট",
  },
  "nav.automation": {
    en: "Automation",
    hi: "स्वचालन",
    ta: "தானியங்கு",
    bn: "অটোমেশন",
  },
  "nav.analytics": {
    en: "Analytics",
    hi: "विश्लेषण",
    ta: "பகுப்பாய்வு",
    bn: "বিশ্লেষণ",
  },
  "nav.settings": {
    en: "Settings",
    hi: "सेटिंग्स",
    ta: "அமைப்புகள்",
    bn: "সেটিংস",
  },
  "nav.help": {
    en: "Help Center",
    hi: "सहायता केंद्र",
    ta: "உதவி மையம்",
    bn: "সহায়তা কেন্দ্র",
  },

  // Common actions
  "action.save": {
    en: "Save",
    hi: "सहेजें",
    ta: "சேமி",
    bn: "সংরক্ষণ",
  },
  "action.cancel": {
    en: "Cancel",
    hi: "रद्द करें",
    ta: "ரத்து செய்",
    bn: "বাতিল",
  },
  "action.delete": {
    en: "Delete",
    hi: "हटाएं",
    ta: "நீக்கு",
    bn: "মুছুন",
  },
  "action.edit": {
    en: "Edit",
    hi: "संपादित करें",
    ta: "திருத்து",
    bn: "সম্পাদনা",
  },
  "action.create": {
    en: "Create",
    hi: "बनाएं",
    ta: "உருவாக்கு",
    bn: "তৈরি করুন",
  },
  "action.search": {
    en: "Search",
    hi: "खोजें",
    ta: "தேடு",
    bn: "অনুসন্ধান",
  },
  "action.send": {
    en: "Send",
    hi: "भेजें",
    ta: "அனுப்பு",
    bn: "পাঠান",
  },
  "action.import": {
    en: "Import",
    hi: "आयात करें",
    ta: "இறக்குமதி",
    bn: "আমদানি",
  },
  "action.export": {
    en: "Export",
    hi: "निर्यात करें",
    ta: "ஏற்றுமதி",
    bn: "রপ্তানি",
  },
  "action.sync": {
    en: "Sync",
    hi: "सिंक करें",
    ta: "ஒத்திசை",
    bn: "সিঙ্ক",
  },

  // Dashboard
  "dashboard.welcome": {
    en: "Welcome back",
    hi: "वापसी पर स्वागत है",
    ta: "மீண்டும் வரவேற்கிறோம்",
    bn: "স্বাগতম",
  },
  "dashboard.totalConversations": {
    en: "Total Conversations",
    hi: "कुल बातचीत",
    ta: "மொத்த உரையாடல்கள்",
    bn: "মোট কথোপকথন",
  },
  "dashboard.activeContacts": {
    en: "Active Contacts",
    hi: "सक्रिय संपर्क",
    ta: "செயலில் உள்ள தொடர்புகள்",
    bn: "সক্রিয় পরিচিতি",
  },
  "dashboard.messagesSent": {
    en: "Messages Sent",
    hi: "भेजे गए संदेश",
    ta: "அனுப்பிய செய்திகள்",
    bn: "পাঠানো বার্তা",
  },
  "dashboard.responseRate": {
    en: "Response Rate",
    hi: "प्रतिक्रिया दर",
    ta: "பதில் விகிதம்",
    bn: "প্রতিক্রিয়া হার",
  },

  // Templates
  "templates.title": {
    en: "Template Messages",
    hi: "टेम्पलेट संदेश",
    ta: "வார்ப்புரு செய்திகள்",
    bn: "টেমপ্লেট বার্তা",
  },
  "templates.create": {
    en: "Create Template",
    hi: "टेम्पलेट बनाएं",
    ta: "வார்ப்புரு உருவாக்கு",
    bn: "টেমপ্লেট তৈরি করুন",
  },
  "templates.syncFromMeta": {
    en: "Sync from Meta",
    hi: "Meta से सिंक करें",
    ta: "Meta இலிருந்து ஒத்திசை",
    bn: "Meta থেকে সিঙ্ক করুন",
  },
  "templates.approved": {
    en: "Approved",
    hi: "स्वीकृत",
    ta: "அங்கீகரிக்கப்பட்டது",
    bn: "অনুমোদিত",
  },
  "templates.pending": {
    en: "Pending",
    hi: "लंबित",
    ta: "நிலுவையில்",
    bn: "বিচারাধীন",
  },
  "templates.rejected": {
    en: "Rejected",
    hi: "अस्वीकृत",
    ta: "நிராகரிக்கப்பட்டது",
    bn: "প্রত্যাখ্যাত",
  },

  // Campaigns
  "campaigns.title": {
    en: "Campaigns",
    hi: "अभियान",
    ta: "பிரச்சாரங்கள்",
    bn: "প্রচারণা",
  },
  "campaigns.create": {
    en: "Create Campaign",
    hi: "अभियान बनाएं",
    ta: "பிரச்சாரம் உருவாக்கு",
    bn: "প্রচারণা তৈরি করুন",
  },
  "campaigns.scheduled": {
    en: "Scheduled",
    hi: "निर्धारित",
    ta: "திட்டமிடப்பட்டது",
    bn: "নির্ধারিত",
  },
  "campaigns.completed": {
    en: "Completed",
    hi: "पूर्ण",
    ta: "முடிந்தது",
    bn: "সম্পন্ন",
  },
  "campaigns.draft": {
    en: "Draft",
    hi: "ड्राफ्ट",
    ta: "வரைவு",
    bn: "খসড়া",
  },

  // Contacts
  "contacts.title": {
    en: "Contacts",
    hi: "संपर्क",
    ta: "தொடர்புகள்",
    bn: "পরিচিতি",
  },
  "contacts.addContact": {
    en: "Add Contact",
    hi: "संपर्क जोड़ें",
    ta: "தொடர்பு சேர்",
    bn: "পরিচিতি যোগ করুন",
  },
  "contacts.importContacts": {
    en: "Import Contacts",
    hi: "संपर्क आयात करें",
    ta: "தொடர்புகளை இறக்குமதி செய்",
    bn: "পরিচিতি আমদানি করুন",
  },

  // Inbox
  "inbox.title": {
    en: "Inbox",
    hi: "इनबॉक्स",
    ta: "இன்பாக்ஸ்",
    bn: "ইনবক্স",
  },
  "inbox.newMessage": {
    en: "New Message",
    hi: "नया संदेश",
    ta: "புதிய செய்தி",
    bn: "নতুন বার্তা",
  },
  "inbox.typeMessage": {
    en: "Type a message...",
    hi: "संदेश टाइप करें...",
    ta: "செய்தி தட்டச்சு செய்...",
    bn: "একটি বার্তা লিখুন...",
  },

  // Landing page
  "landing.hero.title": {
    en: "Scale Your Business with WhatsApp Automation",
    hi: "WhatsApp ऑटोमेशन से अपना व्यापार बढ़ाएं",
    ta: "WhatsApp தானியங்கியுடன் உங்கள் வணிகத்தை விரிவுபடுத்துங்கள்",
    bn: "WhatsApp অটোমেশনের মাধ্যমে আপনার ব্যবসা বৃদ্ধি করুন",
  },
  "landing.hero.subtitle": {
    en: "Transform customer engagement with AI-powered chatbots, bulk messaging, and seamless CRM integration.",
    hi: "AI-संचालित चैटबॉट्स, बल्क मैसेजिंग और सहज CRM एकीकरण के साथ ग्राहक जुड़ाव को बदलें।",
    ta: "AI-இயக்கும் சாட்பாட்கள், மொத்த செய்தி அனுப்புதல் மற்றும் தடையற்ற CRM ஒருங்கிணைப்புடன் வாடிக்கையாளர் ஈடுபாட்டை மாற்றுங்கள்.",
    bn: "AI-চালিত চ্যাটবট, বাল্ক মেসেজিং এবং নির্বিঘ্ন CRM ইন্টিগ্রেশনের মাধ্যমে গ্রাহক সম্পৃক্ততা রূপান্তর করুন।",
  },
  "landing.cta.startTrial": {
    en: "Start Free Trial",
    hi: "मुफ्त ट्रायल शुरू करें",
    ta: "இலவச சோதனையைத் தொடங்கு",
    bn: "বিনামূল্যে ট্রায়াল শুরু করুন",
  },
  "landing.cta.bookDemo": {
    en: "Book a Demo",
    hi: "डेमो बुक करें",
    ta: "டெமோ முன்பதிவு செய்",
    bn: "ডেমো বুক করুন",
  },

  // Common labels
  "common.loading": {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    ta: "ஏற்றுகிறது...",
    bn: "লোড হচ্ছে...",
  },
  "common.noResults": {
    en: "No results found",
    hi: "कोई परिणाम नहीं मिला",
    ta: "முடிவுகள் இல்லை",
    bn: "কোন ফলাফল পাওয়া যায়নি",
  },
  "common.success": {
    en: "Success",
    hi: "सफलता",
    ta: "வெற்றி",
    bn: "সফল",
  },
  "common.error": {
    en: "Error",
    hi: "त्रुटि",
    ta: "பிழை",
    bn: "ত্রুটি",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const availableLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-language");
      if (saved && ["en", "hi", "ta", "bn"].includes(saved)) {
        return saved as Language;
      }
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
