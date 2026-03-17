import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { rooms } from "../data/roomsData";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [savedVideo, setSavedVideo] = useState<string | null>(null);

  const savedRooms = JSON.parse(localStorage.getItem("nesto_rooms") || "[]");
  const allRooms = [...rooms, ...savedRooms];
  const room = allRooms.find((r) => r.id === Number(id));

  // Multiple images for slideshow
  const roomImages = [
    room?.image ? `${room.image}?w=1200&q=85` : "",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85",
  ].filter(Boolean) as string[];

  if (!room) {
    return (
      <div style={s.notFound}>
        <span style={{ fontSize: "4rem" }}>🏚️</span>
        <h2 style={s.notFoundTitle}>Room Not Found</h2>
        <p style={{ color: "#6b7280" }}>This room may have been removed.</p>
        <button onClick={() => navigate("/rooms")} style={s.backBtn}>← Browse All Rooms</button>
      </div>
    );
  }

  const maskedPhone = room.phone
    ? room.phone.slice(0, 4) + "****" + room.phone.slice(-2)
    : "07****56";

  const handleSave = () => {
    const bookmarks = JSON.parse(localStorage.getItem("nesto_saved") || "[]");
    if (!bookmarks.find((b: typeof room) => b.id === room.id)) {
      bookmarks.push(room);
      localStorage.setItem("nesto_saved", JSON.stringify(bookmarks));
    }
    setSaved(true);
  };

  // Convert YouTube/other URLs to embeddable
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Direct video link
    if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
    return url;
  };

  const handleSaveVideo = () => {
    if (videoUrl.trim()) {
      setSavedVideo(videoUrl.trim());
      setShowVideoInput(false);
      setVideoUrl("");
    }
  };

  const embedUrl = getEmbedUrl(savedVideo || "");

  return (
    <div style={s.page}>
      {/* Back bar */}
      <div style={s.backBar}>
        <div style={s.backInner}>
          <button onClick={() => navigate(-1)} style={s.backLink}>← Back</button>
          <span style={s.breadcrumb}>{room.city} / {room.title}</span>
        </div>
      </div>

      <div style={s.container}>

        {/* ── IMAGE SLIDESHOW ─────────────────────────── */}
        <div style={s.galleryWrap}>
          {/* Main image */}
          <div style={s.mainImgWrap}>
            <img
              src={roomImages[currentImg]}
              alt={room.title}
              style={s.mainImg}
            />
            {/* Overlay buttons */}
            <button
              onClick={handleSave}
              style={{ ...s.imgBtn, top: "16px", right: "16px", background: saved ? "#c9a84c" : "rgba(255,255,255,0.9)" }}
            >
              {saved ? "✓ Saved" : "🔖 Save"}
            </button>
            <div style={s.imgCounter}>
              {currentImg + 1} / {roomImages.length}
            </div>
            {/* Prev/Next arrows */}
            <button
              style={{ ...s.galleryArrow, left: "12px" }}
              onClick={() => setCurrentImg((currentImg - 1 + roomImages.length) % roomImages.length)}
            >‹</button>
            <button
              style={{ ...s.galleryArrow, right: "12px" }}
              onClick={() => setCurrentImg((currentImg + 1) % roomImages.length)}
            >›</button>
            {/* City badge */}
            <div style={s.cityBadge}>📍 {room.city}</div>
          </div>

          {/* Thumbnails */}
          <div style={s.thumbRow}>
            {roomImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setCurrentImg(i)}
                style={{
                  ...s.thumb,
                  outline: i === currentImg ? "2.5px solid #c9a84c" : "2.5px solid transparent",
                  opacity: i === currentImg ? 1 : 0.65,
                }}
              >
                <img src={img} alt="" style={s.thumbImg} />
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT GRID ────────────────────────────── */}
        <div style={s.grid}>

          {/* Left */}
          <div style={s.main}>
            {/* Title & Price */}
            <div style={s.titleRow}>
              <div>
                <h1 style={s.title}>{room.title}</h1>
                <p style={s.location}>📍 {room.location}</p>
              </div>
              <div style={s.priceBox}>
                <span style={s.price}>{room.price}</span>
                <span style={s.pricePer}>/month</span>
              </div>
            </div>

            <div style={s.divider} />

            {/* Description */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>About this room</h2>
              <p style={s.description}>{room.description}</p>
            </div>

            {/* Features */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Features</h2>
              <div style={s.features}>
                {["Private bathroom", "Water included", "Security", "Near transport", "Furnished", "Parking"].map((f) => (
                  <div key={f} style={s.feature}>
                    <span style={s.featureCheck}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── VIDEO SECTION ───────────────────────── */}
            <div style={s.section}>
              <div style={s.videoHeader}>
                <h2 style={s.sectionTitle}>Property Video</h2>
                <button
                  onClick={() => setShowVideoInput(!showVideoInput)}
                  style={s.addVideoBtn}
                >
                  {showVideoInput ? "✕ Cancel" : "＋ Add Video"}
                </button>
              </div>

              {/* Video input */}
              {showVideoInput && (
                <div style={s.videoInputWrap}>
                  <p style={s.videoInputHint}>
                    📎 Paste YouTube link or direct video URL
                  </p>
                  <div style={s.videoInputRow}>
                    <input
                      type="text"
                      placeholder="https://youtube.com/watch?v=... or https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      style={s.videoInput}
                    />
                    <button onClick={handleSaveVideo} style={s.videoSaveBtn}>
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Video player */}
              {embedUrl ? (
                <div style={s.videoWrap}>
                  {embedUrl.includes("youtube.com/embed") ? (
                    <iframe
                      src={embedUrl}
                      style={s.videoFrame}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Property video"
                    />
                  ) : (
                    <video
                      src={embedUrl}
                      controls
                      style={s.videoFrame}
                    />
                  )}
                  <button
                    onClick={() => setSavedVideo(null)}
                    style={s.removeVideoBtn}
                  >
                    ✕ Remove video
                  </button>
                </div>
              ) : !showVideoInput && (
                <div style={s.videoPlaceholder}>
                  <span style={{ fontSize: "2.5rem" }}>🎬</span>
                  <p style={s.videoPlaceholderTitle}>No video yet</p>
                  <p style={s.videoPlaceholderSub}>
                    Owner can add a YouTube or video link to showcase this property
                  </p>
                  <button
                    onClick={() => setShowVideoInput(true)}
                    style={s.videoPlaceholderBtn}
                  >
                    ＋ Add Property Video
                  </button>
                </div>
              )}
            </div>

            {/* Map */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Location</h2>
              <Map location={room.location} />
            </div>
          </div>

          {/* Right — Contact Sidebar */}
          <div style={s.sidebar}>
            <div style={s.contactCard}>
              <h3 style={s.contactTitle}>Contact Owner</h3>

              <div style={s.ownerRow}>
                <div style={s.avatar}>{room.title.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={s.ownerName}>Property Owner</p>
                  <p style={s.ownerLabel}>Verified Landlord ✓</p>
                </div>
              </div>

              <div style={s.divider} />

              <div style={s.phoneSection}>
                <p style={s.phoneLabel}>📞 Owner Phone Number</p>
                <div style={s.phoneDisplay}>
                  <span style={s.phoneNumber}>
                    {phoneRevealed ? room.phone : maskedPhone}
                  </span>
                  {phoneRevealed && (
                    <a href={`tel:${room.phone}`} style={s.callBtn}>Call Now</a>
                  )}
                </div>
                {!phoneRevealed ? (
                  <button onClick={() => setPhoneRevealed(true)} style={s.unlockBtn}>
                    🔓 Unlock Contact Number
                  </button>
                ) : (
                  <div style={s.revealedMsg}>✓ Contact unlocked</div>
                )}
              </div>

              <div style={s.divider} />

              {phoneRevealed && (
                <a
                  href={`https://wa.me/255${room.phone?.slice(1)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={s.whatsappBtn}
                >
                  💬 Message on WhatsApp
                </a>
              )}

              <button onClick={handleSave} style={s.saveCardBtn}>
                {saved ? "✓ Saved to Dashboard" : "🔖 Save Room"}
              </button>

              <div style={s.priceSummary}>
                <div style={s.priceRow}>
                  <span>Monthly Rent</span>
                  <span>{room.price}</span>
                </div>
                <div style={s.priceRow}>
                  <span>Deposit (est.)</span>
                  <span>{room.price}</span>
                </div>
                <div style={{ ...s.priceRow, borderTop: "1px solid #e5e0d8", paddingTop: "0.75rem", fontWeight: 600 }}>
                  <span>First Month Total</span>
                  <span style={{ color: "#b85c38" }}>2× {room.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f8f4ed" },
  notFound: { minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "2rem" },
  notFoundTitle: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#0f1923" },
  backBtn: { marginTop: "1rem", background: "#0f1923", color: "#c9a84c", padding: "0.75rem 1.75rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  backBar: { background: "#0f1923", padding: "0.75rem 1.5rem" },
  backInner: { maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" },
  backLink: { background: "transparent", border: "none", color: "#c9a84c", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  breadcrumb: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" },

  // GALLERY
  galleryWrap: { marginBottom: "2rem" },
  mainImgWrap: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    height: "460px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
    marginBottom: "0.75rem",
  },
  mainImg: { width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s ease" },
  imgBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  imgCounter: {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: "0.78rem",
    padding: "5px 12px",
    borderRadius: "20px",
  },
  galleryArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.15)",
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
    zIndex: 2,
    transition: "all 0.2s",
    fontFamily: "sans-serif",
  },
  cityBadge: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    background: "rgba(15,25,35,0.85)",
    backdropFilter: "blur(8px)",
    color: "#c9a84c",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  thumbRow: { display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "4px" },
  thumb: {
    flexShrink: 0,
    width: "90px",
    height: "68px",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },

  // GRID
  grid: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" },
  main: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#0f1923", marginBottom: "0.5rem" },
  location: { color: "#6b7280", fontSize: "0.95rem" },
  priceBox: { background: "#0f1923", borderRadius: "12px", padding: "1rem 1.5rem", textAlign: "center" },
  price: { display: "block", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#c9a84c", fontWeight: 700 },
  pricePer: { color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" },
  divider: { height: "1px", background: "#e5e0d8", margin: "0.25rem 0" },
  section: { display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#0f1923" },
  description: { color: "#4b5563", lineHeight: 1.8, fontSize: "0.95rem" },
  features: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  feature: { display: "flex", alignItems: "center", gap: "8px", color: "#374151", fontSize: "0.875rem" },
  featureCheck: { color: "#c9a84c", fontWeight: 700, fontSize: "1rem" },

  // VIDEO
  videoHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  addVideoBtn: {
    background: "#0f1923",
    color: "#c9a84c",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
  },
  videoInputWrap: {
    background: "#fff",
    borderRadius: "14px",
    padding: "1.25rem",
    border: "1.5px solid #e5e0d8",
  },
  videoInputHint: {
    color: "#6b7280",
    fontSize: "0.82rem",
    marginBottom: "0.75rem",
  },
  videoInputRow: { display: "flex", gap: "0.75rem" },
  videoInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid #e5e0d8",
    fontSize: "0.875rem",
    fontFamily: "'DM Sans', sans-serif",
    color: "#0f1923",
    background: "#fdfaf7",
    outline: "none",
  },
  videoSaveBtn: {
    background: "#c9a84c",
    color: "#0f1923",
    border: "none",
    borderRadius: "10px",
    padding: "0.75rem 1.5rem",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  videoWrap: {
    borderRadius: "16px",
    overflow: "hidden",
    background: "#000",
    position: "relative",
  },
  videoFrame: {
    width: "100%",
    height: "340px",
    border: "none",
    display: "block",
  },
  removeVideoBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  videoPlaceholder: {
    background: "#fff",
    borderRadius: "16px",
    padding: "3rem 2rem",
    textAlign: "center",
    border: "2px dashed #e5e0d8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  videoPlaceholderTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    color: "#0f1923",
  },
  videoPlaceholderSub: {
    color: "#9ca3af",
    fontSize: "0.85rem",
    lineHeight: 1.6,
    maxWidth: "320px",
  },
  videoPlaceholderBtn: {
    marginTop: "0.5rem",
    background: "#0f1923",
    color: "#c9a84c",
    border: "none",
    borderRadius: "10px",
    padding: "0.75rem 1.75rem",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },

  // SIDEBAR
  sidebar: { position: "sticky", top: "90px" },
  contactCard: { background: "#fff", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "1rem" },
  contactTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#0f1923" },
  ownerRow: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "48px", height: "48px", borderRadius: "50%", background: "#0f1923", color: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, flexShrink: 0 },
  ownerName: { fontWeight: 600, color: "#0f1923", fontSize: "0.9rem" },
  ownerLabel: { color: "#6b7280", fontSize: "0.78rem" },
  phoneSection: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  phoneLabel: { color: "#6b7280", fontSize: "0.82rem", fontWeight: 500 },
  phoneDisplay: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8f4ed", borderRadius: "10px", padding: "0.875rem 1rem" },
  phoneNumber: { fontFamily: "monospace", fontSize: "1.15rem", fontWeight: 700, color: "#0f1923", letterSpacing: "0.08em" },
  callBtn: { background: "#0f1923", color: "#c9a84c", padding: "6px 14px", borderRadius: "7px", fontSize: "0.78rem", fontWeight: 600 },
  unlockBtn: { background: "#c9a84c", color: "#0f1923", border: "none", borderRadius: "10px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", width: "100%", fontFamily: "'DM Sans', sans-serif" },
  revealedMsg: { textAlign: "center", color: "#059669", fontSize: "0.82rem", fontWeight: 500 },
  whatsappBtn: { display: "block", textAlign: "center", background: "#25D366", color: "#fff", padding: "0.875rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem" },
  saveCardBtn: { background: "transparent", border: "1.5px solid #e5e0d8", borderRadius: "10px", padding: "0.75rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", color: "#374151", fontFamily: "'DM Sans', sans-serif", width: "100%" },
  priceSummary: { background: "#f8f4ed", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" },
  priceRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#374151" },
};
