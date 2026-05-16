import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isLoggedIn, getCurrentUser, logout } from "../services/authService";
import { LokestaLogo } from "./LokestaLogo";

const ADMIN_EMAIL = "elmasworldwide@gmail.com";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

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

          {/* Logo — exact brand image */}
          <Link to="/" style={{ display: "flex", alignItems: "center", marginRight: "auto", textDecoration: "none", flexShrink: 0 }}>
            <LokestaLogo size={40} showText={true} showTagline={false} />
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
                <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171", fontSize: "0.8rem", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500, padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none" }}>
                  {t("nav.login")}
                </Link>
                <Link to="/register" style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", fontSize: "0.85rem", fontWeight: 700, padding: "0.5rem 1.1rem", borderRadius: "8px", textDecoration: "none" }}>
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
          >
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <span style={{ width: "24px", height: "2px", background: "#fff", borderRadius: "2px", display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "#080f16", borderTop: "1px solid rgba(249,115,22,0.12)", padding: "0.75rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: "0.875rem 1rem", borderRadius: "10px",
                fontSize: "0.95rem", fontWeight: 500, textDecoration: "none",
                color: isActive(to) ? "#f97316" : "rgba(255,255,255,0.75)",
                background: isActive(to) ? "rgba(249,115,22,0.1)" : "transparent",
                ...(to === "/admin" ? { color: "#fbbf24" } : {}),
              }} onClick={() => setMenuOpen(false)}>
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
                <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                  🚪 {t("common.logout")}
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link to="/login" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link to="/register" style={{ flex: 1, textAlign: "center", padding: "0.875rem", borderRadius: "10px", background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }} onClick={() => setMenuOpen(false)}>
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
