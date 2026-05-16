import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isLoggedIn, getCurrentUser, logout } from "../services/authService";

const ADMIN_EMAIL = "elmasworldwide@gmail.com";

// Logo matching the exact orange gradient design from image
function LokestaLogo({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark background */}
      <rect width="100" height="100" rx="22" fill="#0f1923"/>

      {/* Location pin outer ring - orange gradient top arc */}
      <path d="M50 8 C30 8 14 24 14 44 C14 64 50 92 50 92 C50 92 86 64 86 44 C86 24 70 8 50 8Z" fill="url(#pinMain)"/>

      {/* White roof / house structure */}
      <path d="M28 46 L50 28 L72 46" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M34 42 L34 58 L66 58 L66 42" stroke="none" fill="none"/>

      {/* White window grid 2x2 */}
      <rect x="43" y="35" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="51" y="35" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="43" y="42" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="51" y="42" width="6" height="5" rx="1" fill="white" opacity="0.9"/>

      {/* Pin bottom circle */}
      <circle cx="50" cy="68" r="6" fill="#0f1923" opacity="0.5"/>
      <circle cx="50" cy="68" r="3" fill="white" opacity="0.6"/>

      <defs>
        <linearGradient id="pinMain" x1="14" y1="8" x2="86" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="45%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
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
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/rooms", label: t("nav.rooms") },
    { to: "/add-property", label: t("nav.addProperty") },
    { to: "/dashboard", label: t("nav.dashboard") },
    ...(isAdmin ? [{ to: "/admin", label: "⚡ Admin" }] : []),
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: dark ? "rgba(8,14,22,0.97)" : "rgba(15,25,35,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(249,115,22,0.18)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.25rem", height: "68px", display: "flex", alignItems: "center", gap: "0.75rem" }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginRight: "auto", textDecoration: "none", flexShrink: 0 }}>
            <LokestaLogo size={42} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span style={{ lineHeight: 1, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, letterSpacing: "0.02em", fontSize: "1.45rem" }}>
                <span style={{ color: "#ffffff" }}>Loce</span>
                <span style={{ color: "#f97316" }}>sta</span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Find your place anywhere
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                fontSize: "0.85rem", fontWeight: 500, padding: "0.45rem 0.75rem",
                borderRadius: "8px", textDecoration: "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                color: isActive(to) ? "#f97316" : "rgba(255,255,255,0.72)",
                background: isActive(to) ? "rgba(249,115,22,0.1)" : "transparent",
                whiteSpace: "nowrap",
                ...(to === "/admin" ? { color: "#fbbf24", background: "rgba(251,191,36,0.08)" } : {}),
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "20px", padding: "4px 12px 4px 4px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span style={{ color: "#f97316", fontSize: "0.82rem", fontWeight: 600 }}>{user?.name?.split(" ")[0]}</span>
                </div>
                <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", fontSize: "0.8rem", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none" }}>{t("nav.login")}</Link>
                <Link to="/register" style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, padding: "0.5rem 1.1rem", borderRadius: "8px", textDecoration: "none" }}>{t("nav.register")}</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger" style={{ display: "none", flexDirection: "column", gap: "5px", background: "transparent", padding: "8px", cursor: "pointer", border: "none" }} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "#080f16", borderTop: "1px solid rgba(249,115,22,0.12)", padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.95rem", fontWeight: 500, textDecoration: "none", color: isActive(to) ? "#f97316" : "rgba(255,255,255,0.75)", background: isActive(to) ? "rgba(249,115,22,0.1)" : "transparent", ...(to === "/admin" ? { color: "#fbbf24" } : {}) }} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "0.5rem 0" }} />
            {loggedIn ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0.75rem 1rem" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>🚪 Logout</button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link to="/login" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>{t("nav.login")}</Link>
                <Link to="/register" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }} onClick={() => setMenuOpen(false)}>{t("nav.register")}</Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <div style={{ height: "68px" }} />
    </>
  );
}
