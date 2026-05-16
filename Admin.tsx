import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { getRooms } from "../services/roomsService";
import { getCurrentUser, logout } from "../services/authService";
import api from "../services/api";

const ADMIN_EMAIL = "elmasworldwide@gmail.com";

export default function Admin() {
  const { theme } = useApp();
  const dark = theme === "dark";
  const navigate = useNavigate();
  const user = getCurrentUser();

  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, padding: "2rem" }}>
        <div style={{ background: cardBg, borderRadius: "20px", padding: "3rem 2.5rem", textAlign: "center", maxWidth: "380px", width: "100%", border: `1px solid ${borderColor}` }}>
          <span style={{ fontSize: "4rem" }}>🔒</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>Access Denied</h2>
          <p style={{ color: textSecondary, fontSize: "0.9rem", marginBottom: "1.5rem" }}>Admin access only.</p>
          <Link to="/" style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", padding: "0.875rem 2rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem" }}>← Go Home</Link>
        </div>
      </div>
    );
  }

  return <AdminDashboard dark={dark} bg={bg} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} user={user} navigate={navigate} />;
}

function AdminDashboard({ dark, bg, cardBg, textPrimary, textSecondary, borderColor, user, navigate }: any) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rooms, isLoading, refetch } = useQuery({ queryKey: ["admin-rooms"], queryFn: getRooms });

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Futa chumba hiki?")) return;
    setDeletingId(id);
    try { await api.delete(`/rooms/${id}`); refetch(); }
    catch { alert("Imeshindwa kufuta"); }
    finally { setDeletingId(null); }
  };

  const totalRooms = rooms?.length || 0;
  const cities = [...new Set(rooms?.map((r: any) => r.city).filter(Boolean) || [])];
  const avgPrice = rooms?.length ? Math.round(rooms.reduce((s: number, r: any) => s + (r.price || 0), 0) / rooms.length) : 0;
  const filteredRooms = rooms?.filter((r: any) => !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || r.city?.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const inputBorder = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#fdfaf7";

  return (
    <div style={{ minHeight: "100vh", background: bg }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f1923, #1a2a3a)", padding: "1.75rem 1.5rem", borderBottom: "3px solid #f97316" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #f97316, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>⚡</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.4rem" }}>
                <span style={{ color: "#fff" }}>Loce</span><span style={{ color: "#f97316" }}>sta</span> Admin
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>Super Admin · {user?.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", padding: "0.65rem 1.1rem", borderRadius: "9px", fontSize: "0.8rem", fontWeight: 500, border: "1px solid rgba(255,255,255,0.1)" }}>← Website</Link>
            <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "0.65rem 1.1rem", borderRadius: "9px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🚪 Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "🏠", label: "Total Rooms", value: isLoading ? "..." : totalRooms, color: "#f97316" },
            { icon: "🏙️", label: "Cities", value: cities.length, color: "#3b82f6" },
            { icon: "💰", label: "Avg Price", value: isLoading ? "..." : `${avgPrice.toLocaleString()} Tsh`, color: "#10b981" },
            { icon: "🔓", label: "Unlocks Today", value: "—", color: "#8b5cf6" },
            { icon: "👥", label: "Total Users", value: "—", color: "#ec4899" },
          ].map((s) => (
            <div key={s.label} style={{ background: cardBg, borderRadius: "14px", padding: "1.25rem", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: textSecondary, fontSize: "0.72rem", marginTop: "2px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1.75rem", background: cardBg, padding: "5px", borderRadius: "12px", border: `1px solid ${borderColor}`, overflowX: "auto" }}>
          {["Overview", "All Rooms", "Users", "Payments", "Settings"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "none", background: activeTab === tab ? "#0f1923" : "transparent", color: activeTab === tab ? "#f97316" : textSecondary, fontSize: "0.83rem", fontWeight: activeTab === tab ? 600 : 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="dashboard-overview">
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: textPrimary }}>🏠 Latest Listings</h3>
                <button onClick={() => setActiveTab("All Rooms")} style={{ background: "transparent", border: "none", color: "#f97316", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>See all →</button>
              </div>
              {isLoading ? <p style={{ color: textSecondary, fontSize: "0.875rem" }}>Inapakia...</p> :
                rooms?.length === 0 ? <p style={{ color: textSecondary, fontSize: "0.875rem" }}>Hakuna rooms bado</p> : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {rooms?.slice(0, 5).map((r: any) => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem", background: dark ? "rgba(255,255,255,0.03)" : "#f8f4ed", borderRadius: "10px" }}>
                        <img src={r.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60"} alt="" style={{ width: "42px", height: "32px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60")} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: textPrimary, fontSize: "0.8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</p>
                          <p style={{ color: textSecondary, fontSize: "0.68rem" }}>{r.city} · {r.price?.toLocaleString()} Tsh</p>
                        </div>
                        <div style={{ background: "#dcfce7", color: "#166534", padding: "2px 7px", borderRadius: "20px", fontSize: "0.62rem", fontWeight: 600, flexShrink: 0 }}>Live</div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: textPrimary, marginBottom: "1rem" }}>🏙️ Rooms by City</h3>
              {cities.length === 0 ? <p style={{ color: textSecondary, fontSize: "0.875rem" }}>Hakuna data bado</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {cities.map((city: any) => {
                    const count = rooms?.filter((r: any) => r.city === city).length || 0;
                    const pct = totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0;
                    return (
                      <div key={city}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ color: textPrimary, fontSize: "0.8rem", fontWeight: 500 }}>{city}</span>
                          <span style={{ color: "#f97316", fontSize: "0.75rem", fontWeight: 700 }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: "6px", background: dark ? "rgba(255,255,255,0.08)" : "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right, #f97316, #fbbf24)", borderRadius: "3px" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${borderColor}`, gridColumn: "1 / -1" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: textPrimary, marginBottom: "1rem" }}>⚡ Quick Actions</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
                {[
                  { icon: "🏠", label: "Add Room", to: "/add-property", color: "#f97316" },
                  { icon: "🌐", label: "View Website", to: "/", color: "#3b82f6" },
                  { icon: "🔍", label: "Manage Rooms", action: () => setActiveTab("All Rooms"), color: "#10b981" },
                  { icon: "💳", label: "Payments", action: () => setActiveTab("Payments"), color: "#8b5cf6" },
                ].map((a) => (
                  a.to ? (
                    <Link key={a.label} to={a.to} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${borderColor}`, background: dark ? "rgba(255,255,255,0.03)" : "#f8f4ed", color: textPrimary, fontSize: "0.85rem", fontWeight: 500 }}>
                      <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem" }}>{a.icon}</span>
                      {a.label}
                    </Link>
                  ) : (
                    <button key={a.label} onClick={a.action} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1rem", borderRadius: "10px", border: `1px solid ${borderColor}`, background: dark ? "rgba(255,255,255,0.03)" : "#f8f4ed", color: textPrimary, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem" }}>{a.icon}</span>
                      {a.label}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ALL ROOMS */}
        {activeTab === "All Rooms" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary }}>All Rooms ({isLoading ? "..." : filteredRooms.length})</h2>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <input type="text" placeholder="🔍 Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: "0.625rem 1rem", borderRadius: "8px", border: `1.5px solid ${inputBorder}`, fontSize: "0.85rem", color: textPrimary, background: inputBg, fontFamily: "'DM Sans', sans-serif", outline: "none", minWidth: "180px" }} />
                <Link to="/add-property" style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", padding: "0.65rem 1.2rem", borderRadius: "9px", fontSize: "0.85rem", fontWeight: 700 }}>+ Add Room</Link>
              </div>
            </div>
            {isLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {[1,2,3].map(i => <div key={i} style={{ height: "200px", borderRadius: "14px", background: dark ? "rgba(255,255,255,0.05)" : "#e8e0d4" }} />)}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: cardBg, borderRadius: "16px", border: `1px solid ${borderColor}` }}>
                <span style={{ fontSize: "3rem" }}>🏠</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>Hakuna rooms</h3>
                <Link to="/add-property" style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.875rem", display: "inline-block", marginTop: "0.75rem" }}>+ Add First Room</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {filteredRooms.map((room: any) => (
                  <div key={room.id} style={{ background: cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${borderColor}` }}>
                    <div style={{ position: "relative", height: "150px" }}>
                      <img src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"} alt={room.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400")} />
                      <div style={{ position: "absolute", top: "8px", right: "8px", background: "#dcfce7", color: "#166534", padding: "3px 9px", borderRadius: "20px", fontSize: "0.63rem", fontWeight: 600 }}>🟢 Live</div>
                      <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(15,25,35,0.85)", color: "#f97316", padding: "4px 9px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700 }}>{room.price?.toLocaleString()} Tsh/mo</div>
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: textPrimary, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.title}</h3>
                      <p style={{ color: textSecondary, fontSize: "0.72rem", marginBottom: "3px" }}>📍 {room.location}</p>
                      <p style={{ color: textSecondary, fontSize: "0.68rem", marginBottom: "0.875rem" }}>🏙️ {room.city} · Owner ID: {room.ownerId}</p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link to={`/property/${room.id}`} style={{ flex: 1, textAlign: "center", background: dark ? "rgba(255,255,255,0.06)" : "#f8f4ed", color: textPrimary, padding: "7px", borderRadius: "8px", fontSize: "0.73rem", fontWeight: 600, border: `1px solid ${borderColor}` }}>👁️ View</Link>
                        <button onClick={() => handleDeleteRoom(room.id)} disabled={deletingId === room.id} style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "7px", borderRadius: "8px", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
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

        {/* USERS */}
        {activeTab === "Users" && (
          <div style={{ background: cardBg, borderRadius: "16px", padding: "2.5rem", border: `1px solid ${borderColor}`, textAlign: "center" }}>
            <span style={{ fontSize: "3.5rem" }}>👥</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, margin: "1rem 0 0.5rem" }}>Users Management</h3>
            <p style={{ color: textSecondary, fontSize: "0.875rem", maxWidth: "340px", margin: "0.5rem auto 1.5rem" }}>Inahitaji backend admin endpoint. Itaunganishwa hivi karibuni.</p>
            <div style={{ display: "inline-flex", background: dark ? "rgba(249,115,22,0.1)" : "#fff7ed", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "12px", padding: "0.875rem 2rem", gap: "8px", alignItems: "center" }}>
              <span>🚧</span><p style={{ color: "#f97316", fontSize: "0.875rem", fontWeight: 600 }}>Coming Soon</p>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "Payments" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, marginBottom: "1.5rem" }}>💳 Payments Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { icon: "💰", label: "Total Revenue", value: "—", color: "#10b981" },
                { icon: "🔓", label: "Contact Unlocks", value: "—", color: "#f97316" },
                { icon: "⏳", label: "Pending", value: "—", color: "#8b5cf6" },
                { icon: "📊", label: "This Month", value: "—", color: "#3b82f6" },
              ].map((item) => (
                <div key={item.label} style={{ background: cardBg, borderRadius: "14px", padding: "1.25rem", border: `1px solid ${borderColor}` }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: item.color, fontWeight: 700, lineHeight: 1 }}>{item.value}</div>
                  <div style={{ color: textSecondary, fontSize: "0.75rem", marginTop: "4px" }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: dark ? "rgba(249,115,22,0.08)" : "#fff7ed", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "14px", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "#f97316", fontWeight: 600, marginBottom: "0.4rem" }}>🔗 Connect Selcom API</p>
              <p style={{ color: textSecondary, fontSize: "0.82rem" }}>Nenda selcom.net/developers upate merchant account.</p>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "Settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "520px" }}>
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.75rem", border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: textPrimary, marginBottom: "1.5rem" }}>⚙️ Admin Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Admin Name", value: user?.name },
                  { label: "Admin Email", value: user?.email },
                  { label: "Platform Name", value: "Lokesta" },
                  { label: "Unlock Fee (Tsh)", value: "10000" },
                ].map((f) => (
                  <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>{f.label}</label>
                    <input defaultValue={f.value} style={{ padding: "0.75rem 1rem", borderRadius: "9px", border: `1.5px solid ${inputBorder}`, fontSize: "0.875rem", color: textPrimary, background: inputBg, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  </div>
                ))}
                <button style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save Changes</button>
              </div>
            </div>
            <div style={{ background: cardBg, borderRadius: "16px", padding: "1.75rem", border: "1px solid rgba(239,68,68,0.2)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#ef4444", marginBottom: "1.25rem" }}>⚠️ Danger Zone</h3>
              <button onClick={() => { logout(); navigate("/login"); }} style={{ width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "0.875rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🚪 Logout from Admin</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
