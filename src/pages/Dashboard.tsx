import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getCurrentUser, logout } from "../services/authService";

type Room = {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  city?: string;
};

const tabs = ["Overview", "Saved Rooms", "My Listings", "Settings"];

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  const dark = theme === "dark";
  const user = getCurrentUser();

  const [activeTab, setActiveTab] = useState("Overview");
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [myListings, setMyListings] = useState<Room[]>([]);

  useEffect(() => {
    setSavedRooms(JSON.parse(localStorage.getItem("nesto_saved") || "[]"));
    setMyListings(JSON.parse(localStorage.getItem("nesto_rooms") || "[]"));
  }, []);

  const removeFromSaved = (id: number) => {
    const updated = savedRooms.filter((r) => r.id !== id);
    setSavedRooms(updated);
    localStorage.setItem("nesto_saved", JSON.stringify(updated));
  };

  const removeMyListing = (id: number) => {
    const updated = myListings.filter((r) => r.id !== id);
    setMyListings(updated);
    localStorage.setItem("nesto_rooms", JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Theme colors
  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const inputBg = dark ? "#0f1923" : "#fdfaf7";
  const inputBorder = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      {/* Header */}
      <div style={{ background: "#0f1923", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={s.avatar}>
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.4rem", marginBottom: "2px" }}>
                {t("dashboard.welcome")}, {user?.name?.split(" ")[0] || "Samwel"} 👋
              </h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/add-property" style={s.addBtn}>+ Add Property</Link>
            <button onClick={handleLogout} style={s.logoutBtn}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }} className="dashboard-stats">
          {[
            { icon: "🔖", label: t("dashboard.saved"), value: savedRooms.length, color: "#c9a84c" },
            { icon: "🏠", label: t("dashboard.listings"), value: myListings.length, color: "#b85c38" },
            { icon: "👁️", label: "Profile Views", value: 24, color: dark ? "#60a5fa" : "#0f1923" },
            { icon: "📞", label: "Inquiries", value: 7, color: "#059669" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: cardBg, borderRadius: "14px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${borderColor}`, transition: "background 0.3s" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontFamily: "'Playfair Display', serif", fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: textSecondary, fontSize: "0.78rem", marginTop: "2px" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem", background: cardBg, padding: "6px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto", border: `1px solid ${borderColor}` }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: activeTab === tab ? "#0f1923" : "transparent",
                color: activeTab === tab ? "#c9a84c" : textSecondary,
                fontSize: "0.875rem",
                fontWeight: activeTab === tab ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ──────────────────────────────── */}
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="dashboard-overview">
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: textPrimary, marginBottom: "1rem" }}>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { icon: "🏠", label: "List a Property", to: "/add-property" },
                  { icon: "🔍", label: "Browse Rooms", to: "/rooms" },
                ].map((action) => (
                  <Link key={action.to} to={action.to} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: textPrimary, fontSize: "0.875rem", fontWeight: 500 }}>
                    <span>{action.icon}</span> {action.label}
                  </Link>
                ))}
                <button
                  onClick={() => setActiveTab("Settings")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: textPrimary, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>⚙️</span> Settings
                </button>
              </div>
            </div>
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: textPrimary, marginBottom: "1rem" }}>Recent Activity</h3>
              {savedRooms.length === 0 && myListings.length === 0 ? (
                <p style={{ color: textSecondary, fontSize: "0.875rem" }}>No activity yet — start browsing rooms!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {savedRooms.slice(0, 3).map((r) => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#b85c38", flexShrink: 0, display: "block" }} />
                      <span style={{ color: textPrimary, fontSize: "0.875rem" }}>Saved: <strong>{r.title}</strong></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SAVED ROOMS ───────────────────────────── */}
        {activeTab === "Saved Rooms" && (
          <div>
            {savedRooms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: cardBg, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: "3rem" }}>🔖</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>No saved rooms yet</h3>
                <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.5rem" }}>Browse rooms and save your favourites</p>
                <Link to="/rooms" style={s.addBtn}>Browse Rooms</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {savedRooms.map((room) => (
                  <div key={room.id} style={{ background: cardBg, borderRadius: "14px", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flexWrap: "wrap", border: `1px solid ${borderColor}` }}>
                    <img src={`${room.image}?w=120&q=70`} alt={room.title} style={{ width: "80px", height: "60px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: "150px" }}>
                      <Link to={`/property/${room.id}`} style={{ fontWeight: 600, color: textPrimary, fontSize: "0.9rem", display: "block", marginBottom: "2px" }}>{room.title}</Link>
                      <p style={{ color: textSecondary, fontSize: "0.78rem" }}>📍 {room.location}</p>
                      <p style={{ color: "#b85c38", fontWeight: 700, fontSize: "0.85rem", marginTop: "2px" }}>{room.price}/month</p>
                    </div>
                    <button onClick={() => removeFromSaved(room.id)} style={{ background: "transparent", border: "1px solid #fca5a5", color: "#ef4444", padding: "6px 14px", borderRadius: "7px", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MY LISTINGS ───────────────────────────── */}
        {activeTab === "My Listings" && (
          <div>
            {myListings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: cardBg, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: "3rem" }}>🏠</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>No listings yet</h3>
                <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.5rem" }}>Post your first property for free</p>
                <Link to="/add-property" style={s.addBtn}>+ Add Property</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {myListings.map((room) => (
                  <div key={room.id} style={{ background: cardBg, borderRadius: "14px", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flexWrap: "wrap", border: `1px solid ${borderColor}` }}>
                    <img src={`${room.image}?w=120&q=70`} alt={room.title} style={{ width: "80px", height: "60px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120")} />
                    <div style={{ flex: 1, minWidth: "150px" }}>
                      <p style={{ fontWeight: 600, color: textPrimary, fontSize: "0.9rem", marginBottom: "2px" }}>{room.title}</p>
                      <p style={{ color: textSecondary, fontSize: "0.78rem" }}>📍 {room.location}</p>
                      <p style={{ color: "#b85c38", fontWeight: 700, fontSize: "0.85rem", marginTop: "2px" }}>{room.price}/month</p>
                    </div>
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>Active</div>
                    <button onClick={() => removeMyListing(room.id)} style={{ background: "transparent", border: "1px solid #fca5a5", color: "#ef4444", padding: "6px 14px", borderRadius: "7px", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS ──────────────────────────────── */}
        {activeTab === "Settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "560px" }}>

            {/* Appearance */}
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.75rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: textPrimary, marginBottom: "1.5rem" }}>
                🎨 Appearance
              </h3>

              {/* Dark Mode Toggle — Instagram style */}
              <div style={s.settingRow}>
                <div>
                  <p style={{ ...s.settingLabel, color: textPrimary }}>Dark Mode</p>
                  <p style={{ ...s.settingDesc, color: textSecondary }}>Switch between light and dark theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  style={{
                    ...s.toggleTrack,
                    background: dark ? "#c9a84c" : "rgba(0,0,0,0.15)",
                  }}
                  aria-label="Toggle dark mode"
                >
                  <span style={{
                    ...s.toggleThumb,
                    transform: dark ? "translateX(22px)" : "translateX(2px)",
                  }} />
                </button>
              </div>

              <div style={{ height: "1px", background: borderColor, margin: "1rem 0" }} />

              {/* Language Toggle */}
              <div style={s.settingRow}>
                <div>
                  <p style={{ ...s.settingLabel, color: textPrimary }}>Language / Lugha</p>
                  <p style={{ ...s.settingDesc, color: textSecondary }}>
                    {language === "en" ? "Currently: English" : "Sasa hivi: Kiswahili"}
                  </p>
                </div>
                <button
                  onClick={toggleLanguage}
                  style={{
                    ...s.langBtn,
                    background: dark ? "rgba(201,168,76,0.15)" : "#0f1923",
                    color: dark ? "#c9a84c" : "#c9a84c",
                    border: dark ? "1px solid rgba(201,168,76,0.3)" : "none",
                  }}
                >
                  {language === "en" ? "🇹🇿 Kiswahili" : "🇬🇧 English"}
                </button>
              </div>
            </div>

            {/* Profile Settings */}
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.75rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: textPrimary, marginBottom: "1.5rem" }}>
                👤 Profile Settings
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Full Name", value: user?.name || "Samwel", type: "text" },
                  { label: "Email", value: user?.email || "samwel@nesto.co.tz", type: "email" },
                  { label: "Phone", value: "0754123456", type: "tel" },
                  { label: "City", value: "Arusha", type: "text" },
                ].map((field) => (
                  <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      style={{ padding: "0.75rem 1rem", borderRadius: "9px", border: `1.5px solid ${inputBorder}`, fontSize: "0.875rem", color: textPrimary, background: inputBg, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s" }}
                    />
                  </div>
                ))}
                <button style={{ background: "#0f1923", color: "#c9a84c", border: "none", borderRadius: "10px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "0.5rem" }}>
                  Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(239,68,68,0.2)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ef4444", marginBottom: "1.5rem" }}>
                ⚠️ Account
              </h3>
              <button
                onClick={handleLogout}
                style={{ width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "0.875rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                🚪 Logout from NESTO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(201,168,76,0.2)",
    border: "2px solid #c9a84c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    color: "#c9a84c",
    fontWeight: 700,
    flexShrink: 0,
  },
  addBtn: {
    background: "#c9a84c",
    color: "#0f1923",
    fontWeight: 700,
    fontSize: "0.875rem",
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    textDecoration: "none",
    display: "inline-block",
  },
  logoutBtn: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    fontWeight: 600,
    fontSize: "0.875rem",
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  settingLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
    marginBottom: "3px",
  },
  settingDesc: {
    fontSize: "0.78rem",
    lineHeight: 1.4,
  },
  // Instagram-style toggle
  toggleTrack: {
    width: "46px",
    height: "26px",
    borderRadius: "13px",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.3s ease",
    flexShrink: 0,
    padding: 0,
  },
  toggleThumb: {
    position: "absolute",
    top: "3px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#ffffff",
    transition: "transform 0.3s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    display: "block",
  },
  langBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    flexShrink: 0,
  },
};
