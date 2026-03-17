import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const stats = [
  { number: "500+", label: "Rooms Listed" },
  { number: "12", label: "Cities" },
  { number: "2,400+", label: "Happy Tenants" },
];

const cities = [
  { name: "Arusha", emoji: "🌋", rooms: "120+ rooms" },
  { name: "Dar es Salaam", emoji: "🌊", rooms: "250+ rooms" },
  { name: "Moshi", emoji: "⛰️", rooms: "80+ rooms" },
  { name: "Dodoma", emoji: "🏛️", rooms: "60+ rooms" },
  { name: "Zanzibar", emoji: "🏝️", rooms: "95+ rooms" },
  { name: "Mwanza", emoji: "🐟", rooms: "45+ rooms" },
];

const features = [
  { icon: "🔍", title: "Easy Search", desc: "Find rooms by city, price, or type in seconds." },
  { icon: "📞", title: "Direct Contact", desc: "Unlock owner contact and connect directly." },
  { icon: "🗺️", title: "Map View", desc: "See exactly where your room is located." },
  { icon: "🏠", title: "List Free", desc: "Landlords post properties at zero cost." },
];

// Hero slideshow images — bright beautiful rooms
const heroSlides = [
  {
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=95",
    label: "Modern Living Room",
    city: "Dar es Salaam",
  },
  {
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=95",
    label: "Cozy Single Room",
    city: "Arusha",
  },
  {
    img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1800&q=95",
    label: "Bright Studio",
    city: "Zanzibar",
  },
  {
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1800&q=95",
    label: "Spacious Bedsitter",
    city: "Moshi",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [cityHover, setCityHover] = useState<string | null>(null);
  const [featureHover, setFeatureHover] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState("");

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || transitioning) return;
    setPrevSlide(currentSlide);
    setTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setTransitioning(false), 900);
  };

  return (
    <div style={s.page}>

      {/* ── HERO WITH SLIDESHOW ───────────────────────── */}
      <section style={s.hero}>

        {/* Slides — previous fades out, current fades in */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              ...s.slide,
              backgroundImage: `url('${slide.img}')`,
              opacity: i === currentSlide ? 1 : 0,
              transform: i === currentSlide ? "scale(1.03)" : "scale(1)",
              transition: "opacity 1s ease, transform 6s ease",
              zIndex: i === currentSlide ? 1 : 0,
            }}
          />
        ))}

        {/* Overlay — light on right, darker on left for text */}
        <div style={s.heroOverlay} />

        {/* Floating cards */}
        <div style={{ ...s.floatCard, top: "22%", right: "4%" }}>
          <span style={{ fontSize: "1.2rem" }}>🏠</span>
          <div>
            <p style={s.floatTitle}>New Listing</p>
            <p style={s.floatSub}>Arusha · 80,000 Tsh</p>
          </div>
          <span style={s.floatBadge}>NEW</span>
        </div>
        <div style={{ ...s.floatCard, bottom: "28%", right: "8%" }}>
          <span style={{ fontSize: "1.2rem" }}>✅</span>
          <div>
            <p style={s.floatTitle}>Room Verified</p>
            <p style={s.floatSub}>Dar es Salaam</p>
          </div>
        </div>

        {/* Current slide label */}
        <div style={s.slideLabel}>
          <span style={s.slideLabelDot} />
          {heroSlides[currentSlide].label} · {heroSlides[currentSlide].city}
        </div>

        {/* Main content */}
        <div style={s.heroInner}>
          <div style={s.heroContent}>
            <div style={s.badge}>
              <span style={s.badgePulse} />
              🇹🇿 Tanzania's #1 Room Rental Platform
            </div>

            <h1 style={s.heroTitle}>
              Find Your
              <span style={s.titleAccentWrap}>
                <span style={s.titleAccent}> Perfect Room</span>
                <svg style={s.curlSvg} viewBox="0 0 320 14" fill="none">
                  <path d="M2 9 Q80 2 160 9 Q240 16 318 9" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />
              <span style={s.titleWhite}>Across Tanzania</span>
            </h1>

            <p style={s.heroSub}>
              Browse hundreds of verified rooms, apartments and studios.
              Connect directly with landlords — no middlemen, no hidden fees.
            </p>

            {/* Search */}
            <div style={s.searchBox}>
              <div style={s.searchLeft}>
                <span style={{ fontSize: "1rem" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by city or location..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={s.searchInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") window.location.href = `/rooms?search=${searchVal}`;
                  }}
                />
              </div>
              <Link to={`/rooms${searchVal ? `?search=${searchVal}` : ""}`} style={s.searchBtn}>
                Search →
              </Link>
            </div>

            {/* Popular chips */}
            <div style={s.chips}>
              <span style={s.chipsLabel}>Popular:</span>
              {["Arusha", "Dar es Salaam", "Zanzibar", "Moshi"].map((city) => (
                <Link key={city} to={`/rooms?city=${city}`} style={s.chip}>{city}</Link>
              ))}
            </div>

            {/* Stats */}
            <div style={s.statsRow}>
              {stats.map((st, i) => (
                <div key={i} style={{
                  ...s.statBox,
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
                }}>
                  <span style={s.statNum}>{st.number}</span>
                  <span style={s.statLbl}>{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots navigation */}
        <div style={s.slideDots}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                ...s.slideDot,
                background: i === currentSlide ? "#c9a84c" : "rgba(255,255,255,0.4)",
                width: i === currentSlide ? "28px" : "8px",
              }}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          style={{ ...s.arrow, left: "1.5rem" }}
          onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
        >‹</button>
        <button
          style={{ ...s.arrow, right: "1.5rem" }}
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
        >›</button>

        {/* Bottom fade */}
        <div style={s.heroFade} />
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.head}>
            <span style={s.tag}>Why NESTO?</span>
            <h2 style={s.sTitle}>Everything You Need</h2>
            <p style={s.sSub}>Simple, fast and trusted room rentals across Tanzania</p>
          </div>
          <div style={s.featGrid}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  ...s.featCard,
                  transform: featureHover === i ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: featureHover === i ? "0 20px 50px rgba(0,0,0,0.1)" : "0 2px 16px rgba(0,0,0,0.05)",
                  borderTop: featureHover === i ? "3px solid #c9a84c" : "3px solid transparent",
                }}
                onMouseEnter={() => setFeatureHover(i)}
                onMouseLeave={() => setFeatureHover(null)}
              >
                <div style={s.featIcon}>{f.icon}</div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES ───────────────────────────────────── */}
      <section style={s.citiesSection}>
        <div style={s.citiesBg} />
        <div style={s.container}>
          <div style={s.head}>
            <span style={{ ...s.tag, color: "#c9a84c", borderColor: "rgba(201,168,76,0.25)" }}>Locations</span>
            <h2 style={{ ...s.sTitle, color: "#fff" }}>Browse by City</h2>
            <p style={{ ...s.sSub, color: "rgba(255,255,255,0.45)" }}>Rooms in 12+ cities across Tanzania</p>
          </div>
          <div style={s.citiesGrid}>
            {cities.map((c) => (
              <Link
                to={`/rooms?city=${c.name}`}
                key={c.name}
                style={{
                  ...s.cityCard,
                  background: cityHover === c.name ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                  borderColor: cityHover === c.name ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)",
                  transform: cityHover === c.name ? "translateY(-5px)" : "translateY(0)",
                }}
                onMouseEnter={() => setCityHover(c.name)}
                onMouseLeave={() => setCityHover(null)}
              >
                <span style={s.cityEmoji}>{c.emoji}</span>
                <span style={s.cityName}>{c.name}</span>
                <span style={s.cityRooms}>{c.rooms}</span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem", position: "relative", zIndex: 1 }}>
            <Link to="/rooms" style={s.allBtn}>View All Rooms →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section style={{ ...s.section, background: "#fff" }}>
        <div style={s.container}>
          <div style={s.head}>
            <span style={s.tag}>Simple Process</span>
            <h2 style={s.sTitle}>How NESTO Works</h2>
          </div>
          <div style={s.stepsGrid}>
            {[
              { n: "01", icon: "🔍", title: "Search", desc: "Browse rooms by city, price or keyword" },
              { n: "02", icon: "🏠", title: "Choose", desc: "View photos, details and location" },
              { n: "03", icon: "🔓", title: "Unlock", desc: "Reveal owner contact with one click" },
              { n: "04", icon: "🤝", title: "Move In", desc: "Call landlord and arrange your viewing" },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={s.stepN}>{step.n}</div>
                <div style={s.stepIcon}>{step.icon}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
                {i < 3 && <div style={s.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <div style={s.container}>
          <div style={s.ctaBox}>
            <h2 style={s.ctaTitle}>Have a Room to Rent?</h2>
            <p style={s.ctaSub}>List your property for free and reach thousands of tenants across Tanzania instantly.</p>
            <div style={s.ctaBtns}>
              <Link to="/add-property" style={s.ctaPrimary}>🏠 Post Property — Free</Link>
              <Link to="/rooms" style={s.ctaGhost}>Browse Rooms →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.container}>
          <div style={s.footerRow}>
            <div>
              <div style={s.footerLogo}>🏠 NESTO</div>
              <p style={s.footerSub}>Tanzania's trusted room rental platform</p>
            </div>
            <div style={s.footerLinks}>
              {[
                { label: "Browse Rooms", to: "/rooms" },
                { label: "Add Property", to: "/add-property" },
                { label: "Dashboard", to: "/dashboard" },
                { label: "Login", to: "/login" },
              ].map((l) => (
                <Link key={l.to} to={l.to} style={s.footerLink}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div style={s.footerCopy}>© 2026 NESTO. Built with ❤️ in Tanzania 🇹🇿</div>
        </div>
      </footer>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },

  // HERO
  hero: {
    minHeight: "95vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  slide: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    willChange: "opacity, transform",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(100deg, rgba(8,14,22,0.80) 0%, rgba(8,14,22,0.45) 50%, rgba(8,14,22,0.15) 100%)",
    zIndex: 2,
  },
  floatCard: {
    position: "absolute",
    background: "rgba(255,255,255,0.14)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "14px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 5,
    pointerEvents: "none",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  floatTitle: { color: "#fff", fontSize: "0.8rem", fontWeight: 600, margin: 0, lineHeight: 1.2 },
  floatSub: { color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", margin: 0 },
  floatBadge: { background: "#c9a84c", color: "#0f1923", fontSize: "0.62rem", fontWeight: 800, padding: "3px 7px", borderRadius: "6px", letterSpacing: "0.05em" },
  slideLabel: {
    position: "absolute",
    bottom: "5rem",
    right: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.8rem",
    zIndex: 5,
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(8px)",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  slideLabelDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#c9a84c",
    display: "inline-block",
  },
  heroInner: {
    position: "relative",
    zIndex: 4,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    width: "100%",
  },
  heroContent: { maxWidth: "600px" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(201,168,76,0.18)",
    border: "1px solid rgba(201,168,76,0.4)",
    color: "#f0d070",
    fontSize: "0.8rem",
    fontWeight: 500,
    padding: "7px 16px",
    borderRadius: "24px",
    marginBottom: "1.75rem",
    letterSpacing: "0.04em",
    animation: "fadeUp 0.5s ease forwards",
    backdropFilter: "blur(8px)",
  },
  badgePulse: { width: "7px", height: "7px", borderRadius: "50%", background: "#c9a84c", display: "inline-block", boxShadow: "0 0 0 3px rgba(201,168,76,0.3)" },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
    color: "#ffffff",
    lineHeight: 1.1,
    marginBottom: "1.25rem",
    animation: "fadeUp 0.6s ease 0.1s forwards",
    opacity: 0,
    textShadow: "0 2px 24px rgba(0,0,0,0.2)",
  },
  titleAccentWrap: { position: "relative", display: "inline-block" },
  titleAccent: { color: "#c9a84c" },
  titleWhite: { color: "#fff" },
  curlSvg: { position: "absolute", bottom: "-4px", left: "8px", width: "calc(100% - 8px)", height: "14px", pointerEvents: "none" },
  heroSub: {
    color: "rgba(255,255,255,0.88)",
    fontSize: "1.05rem",
    lineHeight: 1.78,
    maxWidth: "500px",
    marginBottom: "2rem",
    animation: "fadeUp 0.6s ease 0.2s forwards",
    opacity: 0,
    textShadow: "0 1px 10px rgba(0,0,0,0.15)",
  },
  searchBox: {
    display: "flex",
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    maxWidth: "520px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    marginBottom: "1.25rem",
    animation: "fadeUp 0.6s ease 0.3s forwards",
    opacity: 0,
  },
  searchLeft: { flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "0 1rem" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: "0.92rem", color: "#0f1923", background: "transparent", fontFamily: "'DM Sans', sans-serif", padding: "1rem 0" },
  searchBtn: { background: "#c9a84c", color: "#0f1923", fontWeight: 700, fontSize: "0.88rem", padding: "0 1.5rem", whiteSpace: "nowrap", display: "flex", alignItems: "center", letterSpacing: "0.02em" },
  chips: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.4s forwards", opacity: 0 },
  chipsLabel: { color: "rgba(255,255,255,0.55)", fontSize: "0.77rem" },
  chip: { color: "rgba(255,255,255,0.88)", fontSize: "0.79rem", padding: "5px 13px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", transition: "all 0.2s" },
  statsRow: {
    display: "flex",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "14px",
    overflow: "hidden",
    maxWidth: "400px",
    animation: "fadeUp 0.6s ease 0.5s forwards",
    opacity: 0,
  },
  statBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "1.1rem 0.5rem", gap: "3px" },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#c9a84c", fontWeight: 700, lineHeight: 1 },
  statLbl: { color: "rgba(255,255,255,0.6)", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" },
  slideDots: {
    position: "absolute",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "6px",
    zIndex: 6,
    alignItems: "center",
  },
  slideDot: {
    height: "8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.35s ease",
    padding: 0,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 6,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "2rem",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "all 0.2s",
  },
  heroFade: { position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, transparent, #f8f4ed)", zIndex: 5 },

  // SHARED
  section: { padding: "5rem 1.5rem", background: "#f8f4ed" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  head: { textAlign: "center", marginBottom: "3.5rem" },
  tag: { display: "inline-block", color: "#b85c38", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(184,92,56,0.22)", padding: "5px 14px", borderRadius: "20px", marginBottom: "0.75rem" },
  sTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "#0f1923", marginBottom: "0.6rem", lineHeight: 1.2 },
  sSub: { color: "#6b7280", fontSize: "0.975rem", lineHeight: 1.65 },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" },
  featCard: { background: "#fff", borderRadius: "18px", padding: "2rem 1.75rem", transition: "all 0.3s ease", cursor: "default", borderTop: "3px solid transparent" },
  featIcon: { fontSize: "2rem", marginBottom: "1rem", display: "block" },
  featTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#0f1923", marginBottom: "0.5rem" },
  featDesc: { color: "#6b7280", fontSize: "0.86rem", lineHeight: 1.65 },
  citiesSection: { padding: "5rem 1.5rem", background: "#0a1018", position: "relative", overflow: "hidden" },
  citiesBg: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,168,76,0.05) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(184,92,56,0.04) 0%, transparent 50%)" },
  citiesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: "1rem", position: "relative", zIndex: 1 },
  cityCard: { borderRadius: "16px", border: "1px solid", padding: "1.75rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all 0.25s ease", cursor: "pointer", textDecoration: "none" },
  cityEmoji: { fontSize: "2.2rem" },
  cityName: { color: "#fff", fontWeight: 600, fontSize: "0.9rem", textAlign: "center" },
  cityRooms: { color: "#c9a84c", fontSize: "0.72rem" },
  allBtn: { display: "inline-block", border: "1.5px solid rgba(201,168,76,0.35)", color: "#c9a84c", padding: "0.875rem 2.5rem", borderRadius: "12px", fontWeight: 600, fontSize: "0.9rem", background: "transparent" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" },
  stepCard: { textAlign: "center", padding: "2rem 1.5rem", background: "#f8f4ed", borderRadius: "16px", position: "relative" },
  stepN: { fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", color: "rgba(201,168,76,0.12)", fontWeight: 700, lineHeight: 1, marginBottom: "0.25rem" },
  stepIcon: { fontSize: "1.75rem", marginBottom: "0.75rem" },
  stepTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#0f1923", marginBottom: "0.5rem" },
  stepDesc: { color: "#6b7280", fontSize: "0.83rem", lineHeight: 1.6 },
  stepArrow: { position: "absolute", right: "-14px", top: "50%", transform: "translateY(-50%)", color: "#c9a84c", fontSize: "1.4rem", zIndex: 2 },
  ctaSection: { padding: "5rem 1.5rem", background: "#0f1923", position: "relative", overflow: "hidden" },
  ctaGlow: { position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "300px", background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  ctaBox: { textAlign: "center", position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff", marginBottom: "1rem", lineHeight: 1.2 },
  ctaSub: { color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" },
  ctaBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  ctaPrimary: { display: "inline-block", background: "#c9a84c", color: "#0f1923", fontWeight: 700, fontSize: "0.95rem", padding: "0.9rem 2rem", borderRadius: "12px" },
  ctaGhost: { display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.65)", fontWeight: 500, fontSize: "0.95rem", padding: "0.9rem 2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.14)" },
  footer: { background: "#060d14", padding: "3rem 1.5rem 2rem" },
  footerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  footerLogo: { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#c9a84c", letterSpacing: "0.1em", marginBottom: "0.4rem", fontWeight: 700 },
  footerSub: { color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" },
  footerLinks: { display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" },
  footerLink: { color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" },
  footerCopy: { textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" },
};
