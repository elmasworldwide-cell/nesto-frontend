import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import { rooms } from "../data/roomsData";
import { useApp } from "../context/AppContext";

type PaymentMethod = "mpesa" | "airtel" | "tigo" | "halo" | "nmb" | "crdb";

const networks = [
  { id: "mpesa" as PaymentMethod, name: "M-Pesa", color: "#E31837", logo: "📱", prefix: "0744, 0745" },
  { id: "airtel" as PaymentMethod, name: "Airtel Money", color: "#FF0000", logo: "📲", prefix: "0784, 0785" },
  { id: "tigo" as PaymentMethod, name: "Tigo Pesa", color: "#0066CC", logo: "💙", prefix: "0713, 0714" },
  { id: "halo" as PaymentMethod, name: "Halopesa", color: "#00A651", logo: "💚", prefix: "0616, 0617" },
  { id: "nmb" as PaymentMethod, name: "NMB Mobile", color: "#FF6600", logo: "🏦", prefix: "NMB Account" },
  { id: "crdb" as PaymentMethod, name: "CRDB Tembo", color: "#006B3C", logo: "🐘", prefix: "CRDB Account" },
];

const UNLOCK_FEE = "10,000 Tsh";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useApp();
  const dark = theme === "dark";

  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [savedVideo, setSavedVideo] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("mpesa");
  const [payPhone, setPayPhone] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const savedRooms = JSON.parse(localStorage.getItem("nesto_rooms") || "[]");
  const allRooms = [...rooms, ...savedRooms];
  const room = allRooms.find((r) => r.id === Number(id));

  const roomImages = [
    room?.image ? `${room.image}?w=1200&q=85` : "",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85",
  ].filter(Boolean) as string[];

  // Theme
  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#fdfaf7";

  if (!room) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "2rem", background: bg }}>
        <span style={{ fontSize: "4rem" }}>🏚️</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: textPrimary }}>Room Not Found</h2>
        <button onClick={() => navigate("/rooms")} style={{ background: "#f97316", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: "10px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ← Browse All Rooms
        </button>
      </div>
    );
  }

  const maskedPhone = room.phone ? room.phone.slice(0, 4) + "****" + room.phone.slice(-2) : "07****56";

  const handleSave = () => {
    const bookmarks = JSON.parse(localStorage.getItem("nesto_saved") || "[]");
    if (!bookmarks.find((b: typeof room) => b.id === room.id)) {
      bookmarks.push(room);
      localStorage.setItem("nesto_saved", JSON.stringify(bookmarks));
    }
    setSaved(true);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
    return url;
  };

  const embedUrl = getEmbedUrl(savedVideo || "");
  const selectedNetwork = networks.find((n) => n.id === payMethod);

  const handleUnlockPay = async () => {
    if (payPhone.length < 9) return;
    setPayLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPayLoading(false);
    setPaySuccess(true);
    setTimeout(() => {
      setPhoneRevealed(true);
      setShowPayModal(false);
      setPaySuccess(false);
      setPayPhone("");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>

      {/* Payment Modal */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={() => !payLoading && setShowPayModal(false)}>
          <div style={{ background: cardBg, borderRadius: "20px", padding: "2rem", width: "100%", maxWidth: "420px", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
            {paySuccess ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#dcfce7", color: "#059669", fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 700 }}>✓</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: textPrimary, marginBottom: "0.5rem" }}>Malipo Yamekamilika! 🎉</h3>
                <p style={{ color: "#059669", fontWeight: 600, fontSize: "0.9rem" }}>Namba ya mmiliki inafunguliwa...</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary }}>🔓 Fungua Mawasiliano</h3>
                  <button onClick={() => setShowPayModal(false)} style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: textSecondary }}>✕</button>
                </div>
                <div style={{ background: dark ? "rgba(249,115,22,0.1)" : "#fff7ed", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem", textAlign: "center" }}>
                  <p style={{ color: textSecondary, fontSize: "0.78rem", marginBottom: "4px" }}>Ada ya kufungua mawasiliano</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#f97316", fontWeight: 700 }}>{UNLOCK_FEE}</p>
                  <p style={{ color: textSecondary, fontSize: "0.75rem", marginTop: "4px" }}>Utapata namba + WhatsApp ya mmiliki</p>
                </div>
                <p style={{ color: textSecondary, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Chagua Mtandao</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  {networks.map((net) => (
                    <button key={net.id} onClick={() => setPayMethod(net.id)} style={{ padding: "0.625rem 0.5rem", borderRadius: "10px", border: payMethod === net.id ? `2px solid ${net.color}` : `1.5px solid ${borderColor}`, background: payMethod === net.id ? `${net.color}15` : inputBg, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                      <span style={{ fontSize: "1.2rem" }}>{net.logo}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: payMethod === net.id ? net.color : textSecondary }}>{net.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151", display: "block", marginBottom: "6px" }}>Nambari ya {selectedNetwork?.name}</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: "14px", color: textSecondary, fontSize: "0.9rem", fontWeight: 600 }}>+255</span>
                    <input type="tel" value={payPhone} onChange={(e) => setPayPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="744123456" style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 3.5rem", borderRadius: "10px", border: `1.5px solid ${borderColor}`, fontSize: "0.9rem", color: textPrimary, background: inputBg, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  </div>
                </div>
                <button onClick={handleUnlockPay} disabled={payLoading || payPhone.length < 9} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "none", background: payPhone.length >= 9 ? (selectedNetwork?.color || "#f97316") : "#ccc", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: payPhone.length >= 9 ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {payLoading ? (
                    <><span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Inachakata...</>
                  ) : `💳 Lipa ${UNLOCK_FEE}`}
                </button>
                <p style={{ textAlign: "center", color: textSecondary, fontSize: "0.72rem", marginTop: "0.75rem" }}>🔒 Malipo yako yanalindwa</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Back bar */}
      <div style={{ background: "#0f1923", padding: "0.75rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "#f97316", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.city} / {room.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1.25rem 4rem" }}>

        {/* Gallery */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "380px", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", marginBottom: "0.75rem" }}>
            <img src={roomImages[currentImg]} alt={room.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={handleSave} style={{ position: "absolute", top: "12px", right: "12px", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", background: saved ? "#f97316" : "rgba(255,255,255,0.92)", color: saved ? "#fff" : "#0f1923", fontFamily: "'DM Sans', sans-serif" }}>
              {saved ? "✓ Saved" : "🔖 Save"}
            </button>
            <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#fff", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px" }}>
              {currentImg + 1} / {roomImages.length}
            </div>
            <button style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1.8rem", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }} onClick={() => setCurrentImg((currentImg - 1 + roomImages.length) % roomImages.length)}>‹</button>
            <button style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1.8rem", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }} onClick={() => setCurrentImg((currentImg + 1) % roomImages.length)}>›</button>
            <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(15,25,35,0.85)", backdropFilter: "blur(8px)", color: "#f97316", padding: "6px 14px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: 600 }}>📍 {room.city}</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "4px" }} className="thumb-row">
            {roomImages.map((img, i) => (
              <div key={i} onClick={() => setCurrentImg(i)} style={{ flexShrink: 0, width: "80px", height: "60px", borderRadius: "8px", overflow: "hidden", cursor: "pointer", outline: i === currentImg ? "2.5px solid #f97316" : "2.5px solid transparent", opacity: i === currentImg ? 1 : 0.65 }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }} className="property-grid">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Title & Price */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }} className="title-row">
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: textPrimary, marginBottom: "0.5rem" }}>{room.title}</h1>
                <p style={{ color: textSecondary, fontSize: "0.95rem" }}>📍 {room.location}</p>
              </div>
              <div style={{ background: "#0f1923", borderRadius: "12px", padding: "0.875rem 1.25rem", textAlign: "center", flexShrink: 0 }}>
                <span style={{ display: "block", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#f97316", fontWeight: 700 }}>{room.price}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>/month</span>
              </div>
            </div>

            <div style={{ height: "1px", background: borderColor }} />

            {/* About */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary, marginBottom: "0.75rem" }}>About this room</h2>
              <p style={{ color: dark ? "rgba(255,255,255,0.7)" : "#4b5563", lineHeight: 1.8, fontSize: "0.95rem" }}>{room.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary, marginBottom: "0.75rem" }}>Features</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {["Private bathroom", "Water included", "Security", "Near transport", "Furnished", "Parking"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", color: dark ? "rgba(255,255,255,0.7)" : "#374151", fontSize: "0.875rem" }}>
                    <span style={{ color: "#f97316", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary }}>Property Video</h2>
                <button onClick={() => setShowVideoInput(!showVideoInput)} style={{ background: "#0f1923", color: "#f97316", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {showVideoInput ? "✕ Cancel" : "＋ Add Video"}
                </button>
              </div>
              {showVideoInput && (
                <div style={{ background: cardBg, borderRadius: "12px", padding: "1.25rem", border: `1.5px solid ${borderColor}`, marginBottom: "1rem" }}>
                  <p style={{ color: textSecondary, fontSize: "0.82rem", marginBottom: "0.75rem" }}>📎 Paste YouTube link au direct video URL</p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <input type="text" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", border: `1.5px solid ${borderColor}`, fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", color: textPrimary, background: inputBg, outline: "none" }} />
                    <button onClick={() => { setSavedVideo(videoUrl); setShowVideoInput(false); setVideoUrl(""); }} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                  </div>
                </div>
              )}
              {embedUrl ? (
                <div style={{ borderRadius: "14px", overflow: "hidden", background: "#000", position: "relative" }}>
                  {embedUrl.includes("youtube.com/embed") ? (
                    <iframe src={embedUrl} style={{ width: "100%", height: "300px", border: "none", display: "block" }} allowFullScreen title="Property video" />
                  ) : (
                    <video src={embedUrl} controls style={{ width: "100%", height: "300px", border: "none", display: "block" }} />
                  )}
                  <button onClick={() => setSavedVideo(null)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "8px", padding: "5px 10px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕ Remove</button>
                </div>
              ) : !showVideoInput && (
                <div style={{ background: cardBg, borderRadius: "14px", padding: "2.5rem 2rem", textAlign: "center", border: `2px dashed ${borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2.5rem" }}>🎬</span>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: textPrimary }}>No video yet</p>
                  <p style={{ color: textSecondary, fontSize: "0.82rem", lineHeight: 1.6, maxWidth: "280px" }}>Owner can add a YouTube or video link</p>
                  <button onClick={() => setShowVideoInput(true)} style={{ marginTop: "0.25rem", background: "#0f1923", color: "#f97316", border: "none", borderRadius: "10px", padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>＋ Add Video</button>
                </div>
              )}
            </div>

            {/* Google Maps */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary, marginBottom: "0.75rem" }}>📍 Location on Map</h2>
              <GoogleMapComponent
                location={room.location}
                city={room.city}
                title={room.title}
                price={room.price}
                height={280}
              />
            </div>
          </div>

          {/* Right — Contact Sidebar */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: cardBg, borderRadius: "20px", padding: "1.5rem", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: `1px solid ${borderColor}`, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: textPrimary }}>Contact Owner</h3>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, flexShrink: 0 }}>
                  {room.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: textPrimary, fontSize: "0.88rem" }}>Property Owner</p>
                  <p style={{ color: textSecondary, fontSize: "0.75rem" }}>Verified Landlord ✓</p>
                </div>
              </div>

              <div style={{ height: "1px", background: borderColor }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ color: textSecondary, fontSize: "0.8rem", fontWeight: 500 }}>📞 Owner Phone Number</p>
                <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8f4ed", borderRadius: "10px", padding: "0.875rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: textPrimary, letterSpacing: "0.08em" }}>
                    {phoneRevealed ? room.phone : maskedPhone}
                  </span>
                  {phoneRevealed && (
                    <a href={`tel:${room.phone}`} style={{ background: "#0f1923", color: "#f97316", padding: "5px 12px", borderRadius: "7px", fontSize: "0.75rem", fontWeight: 600 }}>Call</a>
                  )}
                </div>

                {!phoneRevealed ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ background: dark ? "rgba(249,115,22,0.08)" : "#fff7ed", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                      <p style={{ color: "#f97316", fontWeight: 700, fontSize: "1rem", marginBottom: "2px" }}>{UNLOCK_FEE}</p>
                      <p style={{ color: textSecondary, fontSize: "0.7rem" }}>Ada ya kufungua namba + WhatsApp</p>
                    </div>
                    <button onClick={() => setShowPayModal(true)} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", width: "100%", fontFamily: "'DM Sans', sans-serif" }}>
                      🔓 Lipa {UNLOCK_FEE} — Fungua Namba
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: "center", color: "#059669", fontSize: "0.8rem", fontWeight: 500 }}>✓ Mawasiliano yamefunguliwa</div>
                    <a href={`https://wa.me/255${room.phone?.slice(1)}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#25D366", color: "#fff", padding: "0.875rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem" }}>
                      💬 Message on WhatsApp
                    </a>
                  </>
                )}
              </div>

              <div style={{ height: "1px", background: borderColor }} />

              <button onClick={handleSave} style={{ background: "transparent", border: `1.5px solid ${borderColor}`, borderRadius: "10px", padding: "0.75rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", color: textPrimary, fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
                {saved ? "✓ Saved to Dashboard" : "🔖 Save Room"}
              </button>

              <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8f4ed", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "Monthly Rent", value: room.price },
                  { label: "Deposit (est.)", value: room.price },
                  { label: "Unlock Fee", value: UNLOCK_FEE },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: textPrimary, ...(i === 2 ? { borderTop: `1px solid ${borderColor}`, paddingTop: "0.6rem", fontWeight: 600 } : {}) }}>
                    <span>{row.label}</span>
                    <span style={i === 2 ? { color: "#f97316" } : {}}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
