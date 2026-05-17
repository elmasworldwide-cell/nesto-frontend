import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
type Language = "en" | "sw";

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.rooms": "Rooms",
    "nav.addProperty": "Add Property",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "common.logout": "Logout",
    "common.month": "/month",
    "common.loading": "Loading...",
    "home.stats.rooms": "Rooms Listed",
    "home.stats.cities": "Cities",
    "home.stats.tenants": "Happy Tenants",
    "home.cities.title": "Browse by City",
    "home.cities.sub": "Rooms in 12+ cities across Tanzania",
    "home.browseRooms": "Browse Rooms →",
    "home.cta.title": "Have a Room to Rent?",
    "home.cta.sub": "List your property for free and reach thousands of tenants instantly.",
    "home.cta.btn": "Post Property — Free",
    "rooms.title": "Find Your Room",
    "rooms.searchPlaceholder": "Search by title or location...",
    "rooms.noRooms": "No rooms found",
    "rooms.noRoomsSub": "Try a different search or city filter",
    "rooms.reset": "Reset Filters",
    "rooms.loading": "Loading rooms...",
    "property.back": "Back",
    "property.unlock": "Unlock Contact Number",
    "property.unlocked": "Contact unlocked",
    "property.whatsapp": "Message on WhatsApp",
    "property.save": "Save Room",
    "property.saved": "Saved to Dashboard",
    "property.about": "About this room",
    "property.features": "Features",
    "property.location": "Location",
    "dashboard.welcome": "Welcome back",
    "dashboard.saved": "Saved Rooms",
    "dashboard.listings": "My Listings",
    "dashboard.settings": "Settings",
    "dashboard.overview": "Overview",
  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.rooms": "Vyumba",
    "nav.addProperty": "Ongeza Nyumba",
    "nav.dashboard": "Dashibodi",
    "nav.login": "Ingia",
    "nav.register": "Jisajili",
    "nav.logout": "Ondoka",
    "common.logout": "Ondoka",
    "common.month": "/mwezi",
    "common.loading": "Inapakia...",
    "home.stats.rooms": "Vyumba Vilivyowekwa",
    "home.stats.cities": "Miji",
    "home.stats.tenants": "Wapangaji Wenye Furaha",
    "home.cities.title": "Vinjari kwa Mji",
    "home.cities.sub": "Vyumba katika miji 12+ kote Tanzania",
    "home.browseRooms": "Vinjari Vyumba →",
    "home.cta.title": "Una Chumba cha Kupanga?",
    "home.cta.sub": "Orodhesha mali yako bila malipo na ufikie maelfu ya wapangaji mara moja.",
    "home.cta.btn": "Weka Mali — Bure",
    "rooms.title": "Tafuta Chumba Chako",
    "rooms.searchPlaceholder": "Tafuta kwa jina au eneo...",
    "rooms.noRooms": "Hakuna vyumba vilivyopatikana",
    "rooms.noRoomsSub": "Jaribu utafutaji tofauti au chujio la mji",
    "rooms.reset": "Weka Upya Vichujio",
    "rooms.loading": "Inapakia vyumba...",
    "property.back": "Rudi",
    "property.unlock": "Fungua Nambari ya Mawasiliano",
    "property.unlocked": "Mawasiliano yamefunguliwa",
    "property.whatsapp": "Tuma Ujumbe WhatsApp",
    "property.save": "Hifadhi Chumba",
    "property.saved": "Imehifadhiwa kwenye Dashibodi",
    "property.about": "Kuhusu chumba hiki",
    "property.features": "Vipengele",
    "property.location": "Eneo",
    "dashboard.welcome": "Karibu tena",
    "dashboard.saved": "Vyumba Vilivyohifadhiwa",
    "dashboard.listings": "Orodha Zangu",
    "dashboard.settings": "Mipangilio",
    "dashboard.overview": "Muhtasari",
  },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("nesto_theme") as Theme) || "light"
  );
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("nesto_language") as Language) || "en"
  );

  useEffect(() => {
    localStorage.setItem("nesto_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    const vars =
      theme === "dark"
        ? {
            "--bg-primary": "#0f1923",
            "--bg-secondary": "#1a2a3a",
            "--bg-card": "#1e2d3d",
            "--text-primary": "#f8f4ed",
            "--text-secondary": "#9ca3af",
            "--border": "rgba(255,255,255,0.08)",
            "--input-bg": "#1a2a3a",
          }
        : {
            "--bg-primary": "#f8f4ed",
            "--bg-secondary": "#ffffff",
            "--bg-card": "#ffffff",
            "--text-primary": "#0f1923",
            "--text-secondary": "#6b7280",
            "--border": "rgba(0,0,0,0.08)",
            "--input-bg": "#fdfaf7",
          };
    Object.entries(vars).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v)
    );
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("nesto_language", language);
  }, [language]);

  const toggleTheme = () =>
    setTheme((p) => (p === "light" ? "dark" : "light"));

  const toggleLanguage = () =>
    setLanguage((p) => (p === "en" ? "sw" : "en"));

  const t = (key: string): string =>
    translations[language]?.[key] ?? translations["en"]?.[key] ?? key;

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, language, toggleLanguage, t }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
