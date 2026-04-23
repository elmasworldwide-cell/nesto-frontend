import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isLoggedIn, getCurrentUser, logout } from "../services/authService";

// LOKESTA Logo SVG Component
function LokestLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="18" fill="#0f1923"/>
      {/* Location pin */}
      <path d="M50 12 C33 12 20 25 20 42 C20 62 50 88 50 88 C50 88 80 62 80 42 C80 25 67 12 50 12Z" fill="#2563eb"/>
      <path d="M50 12 C33 12 20 25 20 42 C20 62 50 88 50 88 C50 88 80 62 80 42 C80 25 67 12 50 12Z" fill="url(#logoGrad)" opacity="0.7"/>
      {/* House inside pin */}
      <path d="M34 40 L50 28 L66 40 L66 56 L57 56 L57 47 L43 47 L43 56 L34 56 Z" fill="white"/>
      {/* Door */}
      <rect x="44" y="47" width="12" height="9" rx="1" fill="#1e40af" opacity="0.6"/>
      {/* Window */}
      <rect x="46" y="34" width="8" height="6" rx="1" fill="#1e40af" opacity="0.4"/>
      {/* Inner circle */}
      <circle cx="50" cy="44" r="4" fill="white" opacity="0.2"/>
      <defs>
        <linearGradient id="logoGrad" x1="20" y1="12" x2="80" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, t } = useApp();
  const dark = theme === "dark";
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        ...s.nav,
        background: dark ? "rgba(8,14,22,0.97)" : "rgba(15,25,35,0.97)",
      }}>
        <div style={s.inner}>
          {/* Logo */}
          <Link to="/" style={s.logo}>
            <LokestLogo size={38} />
            <div style={s.logoTextWrap}>
              <span style={s.logoText}>LOKESTA</span>
              <span style={s.logoTagline}>Find your place anywhere</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={s.links}>
            {[
              { to: "/", label: t("nav.home") },
              { to: "/rooms", label: t("nav.rooms") },
              { to: "/add-property", label: t("nav.addProperty") },
              { to: "/dashboard", label: t("nav.dashboard") },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...s.link,
                  color: isActive(to) ? "#c9a84c" : "rgba(255,255,255,0.7)",
                  background: isActive(to) ? "rgba(201,168,76,0.1)" : "transparent",
                }}
              >
                {label}
                {isActive(to) && <span style={s.activeDot} />}
              </Link>
            ))}
          </div>

          {/* Right — Auth */}
          <div style={s.authButtons}>
            {loggedIn ? (
              <>
                <div style={s.userChip}>
                  <div style={s.userAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span style={s.userName}>{user?.name?.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} style={s.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={s.loginBtn}>{t("nav.login")}</Link>
                <Link to="/register" style={s.registerBtn}>{t("nav.register")}</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            style={s.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ ...s.bar, ...(menuOpen ? s.barTop : {}) }} />
            <span style={{ ...s.bar, ...(menuOpen ? s.barMid : {}) }} />
            <span style={{ ...s.bar, ...(menuOpen ? s.barBot : {}) }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            ...s.mobileMenu,
            background: dark ? "#0a1018" : "#0f1923",
          }}>
            {[
              { to: "/", label: `🏠 ${t("nav.home")}` },
              { to: "/rooms", label: `🔍 ${t("nav.rooms")}` },
              { to: "/add-property", label: `➕ ${t("nav.addProperty")}` },
              { to: "/dashboard", label: `📊 ${t("nav.dashboard")}` },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...s.mobileLink,
                  color: isActive(to) ? "#c9a84c" : "rgba(255,255,255,0.75)",
                  background: isActive(to) ? "rgba(201,168,76,0.1)" : "transparent",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div style={s.mobileDivider} />

            {loggedIn ? (
              <>
                <div style={s.mobileUserRow}>
                  <div style={s.userAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                  <div>
                    <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} style={s.mobileLogoutBtn}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <div style={s.mobileAuthRow}>
                <Link to="/login" style={s.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link to="/register" style={s.mobileRegisterBtn} onClick={() => setMenuOpen(false)}>
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <div style={{ height: "72px" }} />
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(201,168,76,0.15)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "72px",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginRight: "auto",
    textDecoration: "none",
  },
  logoTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#c9a84c",
    letterSpacing: "0.12em",
    lineHeight: 1,
  },
  logoTagline: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.6rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  link: {
    position: "relative",
    fontSize: "0.875rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    padding: "0.5rem 0.875rem",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    textDecoration: "none",
  },
  activeDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#c9a84c",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "20px",
    padding: "4px 12px 4px 4px",
  },
  userAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#c9a84c",
    color: "#0f1923",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    flexShrink: 0,
  },
  userName: {
    color: "#c9a84c",
    fontSize: "0.82rem",
    fontWeight: 600,
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#f87171",
    fontSize: "0.82rem",
    fontWeight: 600,
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  loginBtn: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.2s",
    textDecoration: "none",
  },
  registerBtn: {
    background: "#c9a84c",
    color: "#0f1923",
    fontSize: "0.875rem",
    fontWeight: 600,
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    transition: "all 0.2s",
    textDecoration: "none",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    background: "transparent",
    padding: "8px",
    cursor: "pointer",
    border: "none",
  },
  bar: {
    width: "22px",
    height: "2px",
    background: "#fff",
    borderRadius: "2px",
    transition: "all 0.3s",
    display: "block",
  },
  barTop: { transform: "rotate(45deg) translate(5px, 5px)" },
  barMid: { opacity: 0 },
  barBot: { transform: "rotate(-45deg) translate(5px, -5px)" },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem 1.5rem 1.5rem",
    gap: "0.25rem",
    borderTop: "1px solid rgba(201,168,76,0.15)",
  },
  mobileLink: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "all 0.2s",
    textDecoration: "none",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "0.5rem 0",
  },
  mobileUserRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0.75rem 1rem",
  },
  mobileLogoutBtn: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "left",
    margin: "0.25rem 0",
  },
  mobileAuthRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.25rem",
  },
  mobileLoginBtn: {
    flex: 1,
    textAlign: "center",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "rgba(255,255,255,0.8)",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  mobileRegisterBtn: {
    flex: 1,
    textAlign: "center",
    padding: "0.75rem",
    borderRadius: "8px",
    background: "#c9a84c",
    color: "#0f1923",
    fontSize: "0.875rem",
    fontWeight: 700,
  },
};
