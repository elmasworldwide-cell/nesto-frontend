import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { getRooms } from "../services/roomsService";
import api from "../services/api";

const ADMIN_EMAIL = "elmasworldwide@gmail.com";

export default function Admin() {
  const { theme } = useApp();
  const dark = theme === "dark";
  const [activeTab, setActiveTab] = useState("Overview");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const userStr = localStorage.getItem("nesto_user") || localStorage.getItem("lokesta_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, flexDirection: "column", gap: "1rem", padding: "2rem" }}>
        <span style={{ fontSize: "4rem" }}>🔒</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: textPrimary }}>Access Denied</h2>
        <p style={{ color: textSecondary }}>Admin access only</p>
        <Link to="/" style={{ background: "#f97316", color: "#fff", padding: "0.75rem 2rem", borderRadius: "10px", fontWeight: 700, marginTop: "0.5rem" }}>← Go Home</Link>
      </div>
    );
  }

  return (
    <AdminDashboard
      dark={dark} bg={bg} cardBg={cardBg}
      textPrimary={textPrimary} textSecondary={textSecondary}
      borderColor={borderColor} activeTab={activeTab}
      setActiveTab={setActiveTab} deletingId={deletingId}
      setDeletingId={setDeletingId} user={user}
    />
  );
}

function AdminDashboard({ dark, bg, cardBg, textPrimary, textSecondary, borderColor, activeTab, setActiveTab, deletingId, setDeletingId, user }: any) {
  const { data: rooms, isLoading, refetch } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: () => getRooms(),
  });

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Futa chumba hiki?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/rooms/${id}`);
      refetch();
    } catch {
      alert("Imeshindwa kufuta");
    } finally {
      setDeletingId(null);
    }
  };

  const totalRooms = rooms?.length || 0;
  const cities = [...new Set(rooms?.map((r: any) => r.city) || [])];
  const avgPrice = rooms?.length ? Math.round(rooms.reduce((s: number, r: any) => s + r.price, 0) / rooms.length) : 0;

  const tabs = ["Overview", "All Rooms", "Users", "Payments"];

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 100%)", padding: "2rem 1.5rem", borderBottom: "3px solid #f97316" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #f97316, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>⚡</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.6rem", marginBottom: "2px" }}>LOKESTA Admin</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>Welcome, {user?.name} — Super Admin</p>
            </div>
          </div>
          <Link to="/" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", padding: "0.75rem 1.25rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 500, border: "1px solid rgba(255,255,255,0.12)" }}>← Back to Site</Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "🏠", label: "Total Rooms", value: isLoading ? "..." : totalRooms, color: "#f97316" },
            { icon: "🏙️", label: "Cities", value: cities.length, color: "#3b82f6" },
            { icon: "💰", label: "Avg Price", value: `${avgPrice.toLocaleString()} Tsh`, color: "#10b981" },
            { icon: "👥", label: "Total Users", value: "—", color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: textSecondary, fontSize: "0.75rem", marginTop: "2px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.75rem", background: cardBg, padding: "6px", borderRadius: "12px", border: `1px solid ${borderColor}`, overflowX: "auto" }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "none", background: activeTab === tab ? "#0f1923" : "transparent", color: activeTab === tab ? "#f97316" : textSecondary, fontSize: "0.875rem", fontWeight: activeTab === tab ? 600 : 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="dashboard-overview">
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: textPrimary, marginBottom: "1rem" }}>🏠 Recent Listings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {rooms?.slice(0, 5).map((r: any) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem", background: dark ? "rgba(255,255,255,0.03)" : "#f8f4ed", borderRadius: "10px" }}>
                    <img src={r.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60"} alt="" style={{ width: "44px", height: "34px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60")} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: textPrimary, fontSize: "0.82rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                      <p style={{ color: textSecondary, fontSize: "0.72rem" }}>{r.city} · {r.price?.toLocaleString()} Tsh</p>
                    </div>
                    <div style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 600, flexShrink: 0 }}>Live</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: textPrimary, marginBottom: "1rem" }}>🏙️ Rooms by City</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cities.map((city: any) => {
                  const count = rooms?.filter((r: any) => r.city === city).length || 0;
                  const pct = totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0;
                  return (
                    <div key={city}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ color: textPrimary, fontSize: "0.82rem", fontWeight: 500 }}>{city}</span>
                        <span style={{ color: "#f97316", fontSize: "0.78rem", fontWeight: 700 }}>{count} rooms</span>
                      </div>
                      <div style={{ height: "6px", background: dark ? "rgba(255,255,255,0.08)" : "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right, #f97316, #fbbf24)", borderRadius: "3px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ALL ROOMS ── */}
        {activeTab === "All Rooms" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary }}>All Rooms ({isLoading ? "..." : totalRooms})</h2>
              <Link to="/add-property" style={{ background: "#f97316", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 700 }}>+ Add Room</Link>
            </div>
            {isLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {[1,2,3].map(i => <div key={i} style={{ height: "200px", borderRadius: "14px", background: dark ? "rgba(255,255,255,0.05)" : "#e8e0d4" }} />)}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {rooms?.map((room: any) => (
                  <div key={room.id} style={{ background: cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${borderColor}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div style={{ position: "relative", height: "150px" }}>
                      <img src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"} alt={room.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400")} />
                      <div style={{ position: "absolute", top: "8px", right: "8px", background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 600 }}>🟢 Live</div>
                      <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(15,25,35,0.85)", color: "#f97316", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                        {room.price?.toLocaleString()} Tsh/mo
                      </div>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: textPrimary, marginBottom: "4px" }}>{room.title}</h3>
                      <p style={{ color: textSecondary, fontSize: "0.75rem", marginBottom: "4px" }}>📍 {room.location}</p>
                      <p style={{ color: textSecondary, fontSize: "0.72rem", marginBottom: "0.875rem" }}>🏙️ {room.city} · 👤 Owner: {room.ownerId}</p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link to={`/property/${room.id}`} style={{ flex: 1, textAlign: "center", background: dark ? "rgba(255,255,255,0.06)" : "#f8f4ed", color: textPrimary, padding: "7px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${borderColor}` }}>👁️ View</Link>
                        <button onClick={() => handleDeleteRoom(room.id)} disabled={deletingId === room.id} style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "7px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          {deletingId === room.id ? "..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "Users" && (
          <div style={{ background: cardBg, borderRadius: "16px", padding: "2rem", border: `1px solid ${borderColor}`, textAlign: "center" }}>
            <span style={{ fontSize: "3rem" }}>👥</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>Users Management</h3>
            <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.5rem" }}>Inahitaji backend admin endpoint — itakuja hivi karibuni!</p>
            <div style={{ display: "inline-flex", background: dark ? "rgba(249,115,22,0.1)" : "#fff7ed", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "1rem 2rem" }}>
              <p style={{ color: "#f97316", fontSize: "0.875rem", fontWeight: 600 }}>🚧 Coming Soon</p>
            </div>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {activeTab === "Payments" && (
          <div style={{ background: cardBg, borderRadius: "16px", padding: "2rem", border: `1px solid ${borderColor}`, textAlign: "center" }}>
            <span style={{ fontSize: "3rem" }}>💳</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>Payments Dashboard</h3>
            <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.5rem" }}>Itaunganishwa na Selcom API ukipata credentials.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", maxWidth: "500px", margin: "0 auto" }}>
              {[
                { label: "Total Revenue", value: "—", icon: "💰", color: "#10b981" },
                { label: "Unlocks Today", value: "—", icon: "🔓", color: "#f97316" },
                { label: "Pending", value: "—", icon: "⏳", color: "#8b5cf6" },
              ].map((item) => (
                <div key={item.label} style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8f4ed", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${borderColor}` }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: item.color, fontWeight: 700 }}>{item.value}</div>
                  <div style={{ color: textSecondary, fontSize: "0.75rem" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
