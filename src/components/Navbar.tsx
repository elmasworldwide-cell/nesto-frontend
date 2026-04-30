import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isLoggedIn, getCurrentUser, logout } from "../services/authService";

function LokestalLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="18" fill="#0f1923"/>
      <path d="M50 10 C31 10 16 25 16 44 C16 66 50 90 50 90 C50 90 84 66 84 44 C84 25 69 10 50 10Z" fill="url(#og)"/>
      <path d="M32 42 L50 28 L68 42 L68 60 L58 60 L58 50 L42 50 L42 60 L32 60 Z" fill="white"/>
      <rect x="43" y="50" width="14" height="10" rx="2" fill="#f97316" opacity="0.7"/>
      <rect x="44" y="33" width="12" height="8" rx="2" fill="white" opacity="0.5"/>
      <defs>
        <linearGradient id="og" x1="16" y1="10" x2="84" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#f97316"/>
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

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/rooms", label: t("nav.rooms") },
    { to: "/add-property", label: t("nav.addProperty") },
    { to: "/dashboard", label: t("nav.dashboard") },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: dark ? "rgba(8,14,22,0.97)" : "rgba(15,25,35,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(249,115,22,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 1.25rem", height: "68px",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginRight: "auto", textDecoration: "none", flexShrink: 0 }}>
            <LokestalLogo size={40} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#f97316", letterSpacing: "0.1em", lineHeight: 1 }}>
                LOKESTA
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }} className="logo-tagline">
                Find your place anywhere
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 0.75rem",
                borderRadius: "8px", textDecoration: "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                color: isActive(to) ? "#f97316" : "rgba(255,255,255,0.7)",
                background: isActive(to) ? "rgba(249,115,22,0.1)" : "transparent",
                whiteSpace: "nowrap",
              }}>
                {label}
                {isActive(to) && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#f97316" }} />}
              </Link>
            ))}
          </div>

          {/* Auth Desktop */}
          <div className="nav-auth" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {loggedIn ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "20px", padding: "4px 12px 4px 4px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span style={{ color: "#f97316", fontSize: "0.82rem", fontWeight: 600 }}>{user?.name?.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.8rem", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                  {t("nav.login")}
                </Link>
                <Link to="/register" style={{ background: "#f97316", color: "#fff", fontSize: "0.85rem", fontWeight: 700, padding: "0.5rem 1.1rem", borderRadius: "8px", textDecoration: "none" }}>
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            style={{ display: "none", flexDirection: "column", gap: "5px", background: "transparent", padding: "8px", cursor: "pointer", border: "none" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile/Tablet Menu */}
        {menuOpen && (
          <div style={{ background: "#080f16", borderTop: "1px solid rgba(249,115,22,0.12)", padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: "0.875rem 1rem", borderRadius: "10px",
                fontSize: "0.95rem", fontWeight: 500, textDecoration: "none",
                color: isActive(to) ? "#f97316" : "rgba(255,255,255,0.75)",
                background: isActive(to) ? "rgba(249,115,22,0.1)" : "transparent",
              }} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "0.5rem 0" }} />
            {loggedIn ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0.75rem 1rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link to="/login" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link to="/register" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", background: "#f97316", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }} onClick={() => setMenuOpen(false)}>
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <div style={{ height: "68px" }} />
    </>
  );
}
