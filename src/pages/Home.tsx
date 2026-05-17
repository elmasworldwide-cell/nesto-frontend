import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useQuery } from "@tanstack/react-query";
import { getRooms, formatPrice } from "../services/roomsService";

const heroImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80",
];

const cities = [
  { name: "Arusha",        img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=70",  rooms: 124 },
  { name: "Dar es Salaam", img: "https://images.unsplash.com/photo-1580902394724-b08ff05e587b?w=400&q=70", rooms: 389 },
  { name: "Moshi",         img: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=400&q=70", rooms: 67  },
  { name: "Zanzibar",      img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=70", rooms: 203 },
  { name: "Dodoma",        img: "https://images.unsplash.com/photo-1597659840046-8e7e5b8ff6f0?w=400&q=70", rooms: 45  },
  { name: "Mwanza",        img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=70", rooms: 88  },
];

const i18n = {
  en: {
    badge: "Tanzania's #1 Room Rental Platform",
    h1a: "Find Your", h1b: "Perfect Room", h1c: "Across Tanzania",
    subtitle: "Browse hundreds of verified rooms. Connect directly with landlords — no middlemen, no hidden fees.",
    searchPlaceholder: "Search by city or location...",
    searchBtn: "Search",
    popular: "Popular:",
    statsRooms: "Rooms Listed", statsCities: "Cities", statsTenants: "Happy Tenants",
    recentTitle: "Recently Added Rooms",
    viewAll: "View All",
    citiesTitle: "Browse by City",
    citiesSub: "Rooms in 12+ cities across Tanzania",
    roomsLabel: (n: number) => `${n} rooms`,
    howTitle: "How LOKESTA Works",
    howSub: "4 simple steps to find your room",
    steps: [
      { num: "01", icon: "🔍", title: "Search",   desc: "Search for a room by city or neighbourhood" },
      { num: "02", icon: "🏠", title: "Choose",   desc: "View photos, price and full details" },
      { num: "03", icon: "🔓", title: "Unlock",   desc: "Pay 10,000 Tsh to get the owner's number" },
      { num: "04", icon: "✅", title: "Move In",  desc: "Contact the owner directly and move in" },
    ],
    ctaTitle: "Have a Room to Rent?",
    ctaSub: "List your property for free and reach thousands of tenants instantly.",
    ctaBtn: "Post Property — Free",
    footerCopy: "© 2026 LOKESTA. Built with ❤️ in Tanzania 🇹🇿",
    footerLinks: [
      { to: "/rooms", label: "Rooms" },
      { to: "/add-property", label: "List Property" },
      { to: "/dashboard", label: "Dashboard" },
    ],
  },
  sw: {
    badge: "Jukwaa #1 la Kupanga Vyumba Tanzania",
    h1a: "Tafuta", h1b: "Chumba Chako", h1c: "Kote Tanzania",
    subtitle: "Vinjari mamia ya vyumba zilizothibitishwa. Wasiliana moja kwa moja na wamiliki — bila wasuluhishi, bila ada zilizofichwa.",
    searchPlaceholder: "Tafuta mji au eneo...",
    searchBtn: "Tafuta",
    popular: "Maarufu:",
    statsRooms: "Vyumba Vilivyowekwa", statsCities: "Miji", statsTenants: "Wapangaji Wenye Furaha",
    recentTitle: "Vyumba Vilivyoongezwa Hivi Karibuni",
    viewAll: "Ona Zote",
    citiesTitle: "Vinjari kwa Mji",
    citiesSub: "Vyumba katika miji 12+ kote Tanzania",
    roomsLabel: (n: number) => `Vyumba ${n}`,
    howTitle: "Jinsi LOKESTA Inavyofanya Kazi",
    howSub: "Hatua 4 rahisi kupata chumba chako",
    steps: [
      { num: "01", icon: "🔍", title: "Tafuta",  desc: "Tafuta chumba kwa mji au mtaa unaopendelea" },
      { num: "02", icon: "🏠", title: "Chagua",  desc: "Angalia picha, bei na maelezo ya kina" },
      { num: "03", icon: "🔓", title: "Fungua",  desc: "Lipa 10,000 Tsh kupata namba ya mmiliki" },
      { num: "04", icon: "✅", title: "Hamia",   desc: "Wasiliana na mmiliki moja kwa moja uhamie" },
    ],
    ctaTitle: "Una Chumba cha Kupanga?",
    ctaSub: "Orodhesha mali yako bila malipo na ufikie maelfu ya wapangaji mara moja.",
    ctaBtn: "Weka Mali — Bure",
    footerCopy: "© 2026 LOKESTA. Imetengenezwa kwa ❤️ Tanzania 🇹🇿",
    footerLinks: [
      { to: "/rooms", label: "Vyumba" },
      { to: "/add-property", label: "Weka Chumba" },
      { to: "/dashboard", label: "Dashibodi" },
    ],
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { theme, language } = useApp();
  const dark = theme === "dark";
  const tx = language === "sw" ? i18n.sw : i18n.en;

  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState("");

  const { data: rooms } = useQuery({ queryKey: ["rooms"], queryFn: getRooms });
  const hasRooms = rooms && rooms.length > 0;

  useEffect(() => {
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(id);
  }, []);

  const bg = dark ? "#0f1923" : "#f8f4ed";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const goSearch = () =>
    navigate(search.trim() ? `/rooms?search=${encodeURIComponent(search)}` : "/rooms");

  return (
    <div style={{ background: bg, transition: "background 0.3s" }}>

      {/* HERO */}
      <div style={{ position: "relative", height: "100vh", minHeight: "580px", maxHeight: "900px", overflow: "hidden" }}>
        {heroImages.map((img, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 1.2s", opacity: i === heroIdx ? 1 : 0 }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(15,25,35,.72) 0%,rgba(15,25,35,.35) 50%,rgba(15,25,35,.92) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem", textAlign: "center" }}>
          <div style={{ background: "rgba(249,115,22,.15)", border: "1px solid rgba(249,115,22,.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "1.5rem", display: "inline-block" }}>
            <span style={{ color: "#fbbf24", fontSize: "0.82rem", fontWeight: 600 }}>🇹🇿 {tx.badge}</span>
          </div>

          <h1 className="hero-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,6vw,3.8rem)", color: "#fff", lineHeight: 1.15, marginBottom: "1.25rem", maxWidth: "680px" }}>
            {tx.h1a} <span style={{ color: "#f97316" }}>{tx.h1b}</span> {tx.h1c}
          </h1>

          <p style={{ color: "rgba(255,255,255,.72)", fontSize: "clamp(.9rem,2vw,1.05rem)", lineHeight: 1.7, maxWidth: "520px", marginBottom: "2.25rem" }}>
            {tx.subtitle}
          </p>

          {/* Search */}
          <div style={{ display: "flex", width: "100%", maxWidth: "540px", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.3)", background: "#fff" }} className="hero-search">
            <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 1.25rem", gap: "10px" }}>
              <span style={{ fontSize: "1.1rem" }}>🔍</span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
                placeholder={tx.searchPlaceholder}
                style={{ flex: 1, border: "none", outline: "none", fontSize: ".95rem", color: "#0f1923", background: "transparent", padding: "1rem 0", fontFamily: "'DM Sans',sans-serif" }}
              />
            </div>
            <button onClick={goSearch} className="hero-search-btn" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#fff", border: "none", padding: "0 1.5rem", fontWeight: 700, fontSize: ".9rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
              {tx.searchBtn} →
            </button>
          </div>

          {/* City pills */}
          <div style={{ display: "flex", gap: ".5rem", marginTop: "1.25rem", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,.45)", fontSize: ".8rem", alignSelf: "center" }}>{tx.popular}</span>
            {["Arusha","Dar es Salaam","Zanzibar","Moshi"].map((c) => (
              <button key={c} onClick={() => navigate(`/rooms?city=${c}`)} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "4px 14px", borderRadius: "20px", fontSize: ".78rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 2 }}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === heroIdx ? "#f97316" : "rgba(255,255,255,.4)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: "#0f1923", padding: "2rem 1.25rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "clamp(2rem,6vw,5rem)", flexWrap: "wrap" }} className="stats-row">
          {[{ v: "2,400+", l: tx.statsRooms },{ v: "12+", l: tx.statsCities },{ v: "8,000+", l: tx.statsTenants }].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 700, color: "#f97316", lineHeight: 1 }}>{s.v}</div>
              <div style={{ color: "rgba(255,255,255,.45)", fontSize: ".8rem", marginTop: "4px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE ROOMS — only if rooms exist, no empty state */}
      {hasRooms && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.25rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: textPrimary }}>
              {tx.recentTitle}
            </h2>
            <Link to="/rooms" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#fff", padding: ".7rem 1.4rem", borderRadius: "10px", fontWeight: 700, fontSize: ".875rem", whiteSpace: "nowrap" }}>
              {tx.viewAll} →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.25rem" }} className="rooms-grid">
            {rooms.slice(0, 6).map((room: any) => (
              <Link key={room.id} to={`/property/${room.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${border}`, transition: "transform .2s,box-shadow .2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,.15)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", height: "175px" }}>
                    <img src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70"} alt={room.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70")} loading="lazy" />
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(15,25,35,.85)", color: "#f97316", padding: "4px 10px", borderRadius: "20px", fontSize: ".78rem", fontWeight: 700 }}>
                      {formatPrice(room.price)}/mo
                    </div>
                  </div>
                  <div style={{ padding: ".875rem 1rem" }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: ".95rem", color: textPrimary, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.title}</h3>
                    <p style={{ color: textSecondary, fontSize: ".75rem" }}>📍 {room.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CITIES — unique list, no duplicates */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.25rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: textPrimary, marginBottom: ".4rem" }}>
            {tx.citiesTitle}
          </h2>
          <p style={{ color: textSecondary, fontSize: ".85rem" }}>{tx.citiesSub}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: "1rem" }} className="cities-grid">
          {cities.map((city) => (
            <Link key={city.name} to={`/rooms?city=${encodeURIComponent(city.name)}`} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: "14px", overflow: "hidden", position: "relative", height: "125px", cursor: "pointer" }}
                onMouseEnter={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.08)"; }}
                onMouseLeave={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}
              >
                <img src={city.img} alt={city.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", display: "block" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,25,35,.85) 0%,transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: "8px", left: "10px", right: "10px" }}>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: ".85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {city.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,.55)", fontSize: ".68rem", margin: 0 }}>
                    {tx.roomsLabel(city.rooms)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/rooms" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#fff", padding: ".875rem 2rem", borderRadius: "12px", fontWeight: 700, fontSize: ".95rem", display: "inline-block" }}>
            {tx.viewAll} →
          </Link>
        </div>
      </div>

      {/* HOW IT WORKS — strict 2×2 grid */}
      <div style={{ background: "#0f1923", padding: "4rem 1.25rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: "#fff", marginBottom: ".4rem" }}>
              {tx.howTitle}
            </h2>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: ".85rem" }}>{tx.howSub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {tx.steps.map((step) => (
              <div key={step.num} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(249,115,22,.18)", borderRadius: "16px", padding: "1.75rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".75rem" }}>
                  <span style={{ color: "#f97316", fontWeight: 800, fontSize: ".85rem", letterSpacing: ".06em" }}>{step.num}</span>
                  <span style={{ fontSize: "1.75rem" }}>{step.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: "1.1rem", marginBottom: ".4rem" }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".85rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,#f97316 0%,#fbbf24 100%)", padding: "3.5rem 1.25rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }} className="cta-inner">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", marginBottom: ".4rem" }}>{tx.ctaTitle}</h2>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: ".9rem" }}>{tx.ctaSub}</p>
          </div>
          <Link to="/add-property" style={{ background: "#0f1923", color: "#f97316", padding: ".9rem 1.75rem", borderRadius: "12px", fontWeight: 700, fontSize: ".95rem", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
            🏠 {tx.ctaBtn}
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#080f16", padding: "1.75rem 1.25rem", borderTop: "1px solid rgba(249,115,22,.1)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }} className="footer-row">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
            <span style={{ color: "#fff" }}>Loce</span><span style={{ color: "#f97316" }}>sta</span>
          </span>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: ".75rem" }}>{tx.footerCopy}</p>
          <div style={{ display: "flex", gap: "1.5rem" }} className="footer-links">
            {tx.footerLinks.map((link) => (
              <Link key={link.to} to={link.to} style={{ color: "rgba(255,255,255,.35)", fontSize: ".8rem" }}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
