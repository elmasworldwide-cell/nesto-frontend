import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isLoggedIn, getCurrentUser, logout } from "../services/authService";

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
            <span style={{ fontSize: "1.4rem" }}>🏠</span>
            <span style={s.logoText}>NESTO</span>
          </Link>

          {/* Desktop Links */}
          <div style={s.links} className="nav-links">
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

          {/* Right — Auth buttons */}
          <div style={s.authButtons} className="nav-auth">
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
            className="nav-hamburger"
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
    gap: "0.5rem",
    marginRight: "auto",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#c9a84c",
    letterSpacing: "0.12em",
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
