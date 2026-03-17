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

const translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.rooms": "Rooms",
    "nav.addProperty": "Add Property",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    // Home
    "home.badge": "🇹🇿 Tanzania's #1 Room Rental Platform",
    "home.title1": "Find Your",
    "home.title2": "Perfect Room",
    "home.title3": "Across Tanzania",
    "home.subtitle": "Browse hundreds of verified rooms, apartments and studios. Connect directly with landlords — no middlemen, no hidden fees.",
    "home.searchPlaceholder": "Search by city or location...",
    "home.searchBtn": "Search →",
    "home.popular": "Popular:",
    "home.browseRooms": "Browse Rooms →",
    "home.listProperty": "List Your Property",
    "home.stats.rooms": "Rooms Listed",
    "home.stats.cities": "Cities",
    "home.stats.tenants": "Happy Tenants",
    "home.features.title": "Everything You Need",
    "home.features.sub": "Simple, fast and trusted room rentals across Tanzania",
    "home.cities.title": "Browse by City",
    "home.cities.sub": "Rooms in 12+ cities across Tanzania",
    "home.how.title": "How NESTO Works",
    "home.cta.title": "Have a Room to Rent?",
    "home.cta.sub": "List your property for free and reach thousands of tenants instantly.",
    "home.cta.btn": "🏠 Post Property — Free",
    "home.footer.copy": "© 2026 NESTO. Built with ❤️ in Tanzania 🇹🇿",
    // Rooms
    "rooms.title": "Find Your Room",
    "rooms.searchPlaceholder": "Search by title or location...",
    "rooms.sortDefault": "Sort: Default",
    "rooms.sortPriceAsc": "Price: Low to High",
    "rooms.sortPriceDesc": "Price: High to Low",
    "rooms.noRooms": "No rooms found",
    "rooms.noRoomsSub": "Try a different search or city filter",
    "rooms.reset": "Reset Filters",
    "rooms.live": "🟢 Live from database",
    "rooms.offline": "📴 Offline mode",
    "rooms.loading": "Loading rooms...",
    // Login
    "login.title": "Welcome back",
    "login.subtitle": "Sign in to your NESTO account",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.btn": "Login →",
    "login.loading": "Signing in...",
    "login.noAccount": "Don't have an account?",
    "login.createAccount": "Create account",
    "login.demo": "Fill Demo Credentials",
    "login.orGoogle": "or continue with",
    // Register
    "register.title": "Create account",
    "register.subtitle": "Join NESTO and find your perfect space",
    "register.name": "Full Name",
    "register.email": "Email Address",
    "register.password": "Password",
    "register.btn": "Create Account →",
    "register.loading": "Creating account...",
    "register.hasAccount": "Already have an account?",
    "register.signIn": "Sign in",
    // Property
    "property.back": "← Back",
    "property.contact": "Contact Owner",
    "property.unlock": "🔓 Unlock Contact Number",
    "property.unlocked": "✓ Contact unlocked",
    "property.whatsapp": "💬 Message on WhatsApp",
    "property.save": "🔖 Save Room",
    "property.saved": "✓ Saved to Dashboard",
    "property.about": "About this room",
    "property.features": "Features",
    "property.location": "Location",
    "property.video": "Property Video",
    "property.addVideo": "＋ Add Video",
    "property.noVideo": "No video yet",
    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.saved": "Saved Rooms",
    "dashboard.listings": "My Listings",
    "dashboard.settings": "Settings",
    "dashboard.overview": "Overview",
    // Common
    "common.month": "/month",
    "common.viewDetails": "View Details →",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
  },
  sw: {
    // Navbar
    "nav.home": "Nyumbani",
    "nav.rooms": "Vyumba",
    "nav.addProperty": "Ongeza Nyumba",
    "nav.dashboard": "Dashibodi",
    "nav.login": "Ingia",
    "nav.register": "Jisajili",
    // Home
    "home.badge": "🇹🇿 Jukwaa #1 la Kupanga Vyumba Tanzania",
    "home.title1": "Tafuta",
    "home.title2": "Chumba Chako",
    "home.title3": "Kote Tanzania",
    "home.subtitle": "Vinjari mamia ya vyumba, nyumba na studio zilizothibitishwa. Wasiliana moja kwa moja na wamiliki — bila wasuluhishi, bila ada zilizofichwa.",
    "home.searchPlaceholder": "Tafuta mji au eneo...",
    "home.searchBtn": "Tafuta →",
    "home.popular": "Maarufu:",
    "home.browseRooms": "Vinjari Vyumba →",
    "home.listProperty": "Weka Nyumba Yako",
    "home.stats.rooms": "Vyumba Vilivyoorodheshwa",
    "home.stats.cities": "Miji",
    "home.stats.tenants": "Wapangaji Wenye Furaha",
    "home.features.title": "Kila Unachohitaji",
    "home.features.sub": "Upangaji wa vyumba rahisi, wa haraka na wa kuaminiwa kote Tanzania",
    "home.cities.title": "Tafuta kwa Mji",
    "home.cities.sub": "Vyumba katika miji 12+ kote Tanzania",
    "home.how.title": "NESTO Inafanyaje Kazi",
    "home.cta.title": "Una Chumba cha Kupanga?",
    "home.cta.sub": "Orodhesha mali yako bila malipo na ufikie maelfu ya wapangaji mara moja.",
    "home.cta.btn": "🏠 Weka Mali — Bure",
    "home.footer.copy": "© 2026 NESTO. Imetengenezwa kwa ❤️ Tanzania 🇹🇿",
    // Rooms
    "rooms.title": "Tafuta Chumba Chako",
    "rooms.searchPlaceholder": "Tafuta kwa jina au eneo...",
    "rooms.sortDefault": "Panga: Kawaida",
    "rooms.sortPriceAsc": "Bei: Chini hadi Juu",
    "rooms.sortPriceDesc": "Bei: Juu hadi Chini",
    "rooms.noRooms": "Hakuna vyumba vilivyopatikana",
    "rooms.noRoomsSub": "Jaribu utafutaji tofauti au chujio la mji",
    "rooms.reset": "Weka Upya Vichujio",
    "rooms.live": "🟢 Moja kwa moja kutoka database",
    "rooms.offline": "📴 Hali ya nje ya mtandao",
    "rooms.loading": "Inapakia vyumba...",
    // Login
    "login.title": "Karibu tena",
    "login.subtitle": "Ingia kwenye akaunti yako ya NESTO",
    "login.email": "Anwani ya Barua Pepe",
    "login.password": "Nenosiri",
    "login.btn": "Ingia →",
    "login.loading": "Inaingia...",
    "login.noAccount": "Huna akaunti?",
    "login.createAccount": "Fungua akaunti",
    "login.demo": "Jaza Maelezo ya Demo",
    "login.orGoogle": "au endelea na",
    // Register
    "register.title": "Fungua akaunti",
    "register.subtitle": "Jiunge na NESTO na upate nafasi yako",
    "register.name": "Jina Kamili",
    "register.email": "Anwani ya Barua Pepe",
    "register.password": "Nenosiri",
    "register.btn": "Fungua Akaunti →",
    "register.loading": "Inafungua akaunti...",
    "register.hasAccount": "Una akaunti tayari?",
    "register.signIn": "Ingia",
    // Property
    "property.back": "← Rudi",
    "property.contact": "Wasiliana na Mmiliki",
    "property.unlock": "🔓 Fungua Nambari ya Mawasiliano",
    "property.unlocked": "✓ Mawasiliano yamefunguliwa",
    "property.whatsapp": "💬 Tuma Ujumbe WhatsApp",
    "property.save": "🔖 Hifadhi Chumba",
    "property.saved": "✓ Imehifadhiwa kwenye Dashibodi",
    "property.about": "Kuhusu chumba hiki",
    "property.features": "Vipengele",
    "property.location": "Eneo",
    "property.video": "Video ya Mali",
    "property.addVideo": "＋ Ongeza Video",
    "property.noVideo": "Hakuna video bado",
    // Dashboard
    "dashboard.welcome": "Karibu tena",
    "dashboard.saved": "Vyumba Vilivyohifadhiwa",
    "dashboard.listings": "Orodha Zangu",
    "dashboard.settings": "Mipangilio",
    "dashboard.overview": "Muhtasari",
    // Common
    "common.month": "/mwezi",
    "common.viewDetails": "Tazama Maelezo →",
    "common.loading": "Inapakia...",
    "common.error": "Hitilafu imetokea",
  },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("nesto_theme") as Theme) || "light";
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("nesto_language") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("nesto_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.style.setProperty("--bg-primary", "#0f1923");
      document.documentElement.style.setProperty("--bg-secondary", "#1a2a3a");
      document.documentElement.style.setProperty("--bg-card", "#1e2d3d");
      document.documentElement.style.setProperty("--text-primary", "#f8f4ed");
      document.documentElement.style.setProperty("--text-secondary", "#9ca3af");
      document.documentElement.style.setProperty("--border", "rgba(255,255,255,0.08)");
      document.documentElement.style.setProperty("--input-bg", "#1a2a3a");
    } else {
      document.documentElement.style.setProperty("--bg-primary", "#f8f4ed");
      document.documentElement.style.setProperty("--bg-secondary", "#ffffff");
      document.documentElement.style.setProperty("--bg-card", "#ffffff");
      document.documentElement.style.setProperty("--text-primary", "#0f1923");
      document.documentElement.style.setProperty("--text-secondary", "#6b7280");
      document.documentElement.style.setProperty("--border", "rgba(0,0,0,0.08)");
      document.documentElement.style.setProperty("--input-bg", "#fdfaf7");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("nesto_language", language);
  }, [language]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "sw" : "en"));

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
