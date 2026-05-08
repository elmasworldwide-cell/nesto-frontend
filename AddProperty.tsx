import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useApp } from "../context/AppContext";
import { isLoggedIn } from "../services/authService";
import api from "../services/api";

const CLOUDINARY_UPLOAD_PRESET = "nesto_upload";
const CLOUDINARY_CLOUD_NAME = "dbhkwhthz";

export default function AddProperty() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const dark = theme === "dark";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({ title: "", price: "", city: "", location: "", description: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = ["Arusha", "Dar es Salaam", "Moshi", "Zanzibar", "Dodoma", "Mwanza", "Tanga", "Other"];

  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#fdfaf7";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload imeshindwa");
    const data = await res.json();
    if (!data.secure_url) throw new Error("URL haikupatikana");
    return data.secure_url;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploadingImg(true);
    const newPreviews: string[] = [];
    const newUrls: string[] = [];
    for (const file of acceptedFiles.slice(0, 5)) {
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);
      try { newUrls.push(await uploadToCloudinary(file)); }
      catch { newUrls.push(previewUrl); }
    }
    setPreviews((p) => [...p, ...newPreviews]);
    setUploadedImages((p) => [...p, ...newUrls]);
    setUploadingImg(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = (i: number) => {
    setPreviews((p) => p.filter((_, idx) => idx !== i));
    setUploadedImages((p) => p.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title inahitajika";
    if (!form.price.trim()) e.price = "Bei inahitajika";
    else if (isNaN(parseInt(form.price)) || parseInt(form.price) <= 0) e.price = "Bei lazima iwe nambari sahihi";
    if (!form.city) e.city = "Chagua mji";
    if (!form.location.trim()) e.location = "Eneo linahitajika";
    if (!form.phone.trim()) e.phone = "Simu inahitajika";
    else if (!/^0[67]\d{8}$/.test(form.phone)) e.phone = "Namba si sahihi (mfano: 0754123456)";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (!isLoggedIn()) { setApiError("Lazima uingie kwanza — bonyeza Login"); return; }
    setLoading(true);
    setApiError("");
    try {
      await api.post("/rooms", {
        title: form.title.trim(),
        description: form.description.trim() || "Chumba kinapatikana",
        price: parseInt(form.price),
        location: form.location.trim(),
        city: form.city,
        phone: form.phone.trim(),
        images: uploadedImages.length > 0 ? uploadedImages : [],
      });
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err: unknown) {
      const e = err as any;
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message;
      setApiError(msg || "Imeshindwa kuchapisha — jaribu tena");
    } finally {
      setLoading(false);
    }
  };

  const inp = (field: string): React.CSSProperties => ({
    padding: "0.875rem 1rem", borderRadius: "10px",
    border: `1.5px solid ${errors[field] ? "#ef4444" : borderColor}`,
    fontSize: "0.9rem", color: textPrimary, background: inputBg,
    fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
  });

  if (submitted) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, padding: "2rem" }}>
        <div style={{ background: cardBg, borderRadius: "24px", padding: "3rem 2rem", textAlign: "center", maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: textPrimary }}>Chumba Kimewekwa!</h2>
          <p style={{ color: textSecondary, fontSize: "0.9rem" }}>"{form.title}" imewekwa kwenye LOKESTA.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f97316", fontSize: "0.82rem" }}>
            <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(249,115,22,0.3)", borderTopColor: "#f97316", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
            Unahamishwa Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      {/* Header */}
      <div style={{ background: "#0f1923", padding: "2rem 1.25rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#fff", marginBottom: "0.4rem" }}>List Your Property</h1>
          <p style={{ color: "#f97316", fontSize: "0.9rem" }}>Reach thousands of tenants — for free</p>
          {!isLoggedIn() && (
            <div style={{ marginTop: "0.875rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", padding: "10px 16px", borderRadius: "10px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              ⚠️ <span><Link to="/login" style={{ color: "#fca5a5", fontWeight: 700 }}>Ingia kwanza</Link> ili chumba chako kionekane na wote</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        <div style={{ background: cardBg, borderRadius: "20px", padding: "clamp(1.25rem, 4vw, 2rem)", boxShadow: "0 4px 30px rgba(0,0,0,0.08)", border: `1px solid ${borderColor}` }}>

          {apiError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <div>
                <p style={{ fontWeight: 600 }}>{apiError}</p>
                {!isLoggedIn() && <Link to="/login" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "underline", fontSize: "0.82rem" }}>→ Ingia sasa</Link>}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Photo Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>
                📸 Picha za Chumba (max 5)
              </label>
              <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? "#f97316" : borderColor}`, borderRadius: "14px", padding: "clamp(1.25rem, 4vw, 2rem)", textAlign: "center", cursor: "pointer", background: isDragActive ? "rgba(249,115,22,0.06)" : inputBg, transition: "all 0.2s" }}>
                <input {...getInputProps()} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2rem" }}>📸</span>
                  {isDragActive ? (
                    <p style={{ color: "#f97316", fontWeight: 600, fontSize: "0.9rem" }}>Acha picha hapa!</p>
                  ) : (
                    <>
                      <p style={{ color: textPrimary, fontWeight: 600, fontSize: "0.9rem" }}>Bonyeza au drag picha hapa</p>
                      <p style={{ color: textSecondary, fontSize: "0.75rem" }}>JPG, PNG, WebP — Max 5MB</p>
                      <div style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", padding: "8px 20px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600 }}>
                        Chagua Picha
                      </div>
                    </>
                  )}
                </div>
              </div>

              {uploadingImg && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f97316", fontSize: "0.82rem" }}>
                  <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(249,115,22,0.3)", borderTopColor: "#f97316", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Inapakia picha...
                </div>
              )}

              {previews.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "0.625rem" }}>
                  {previews.map((preview, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "1", border: `2px solid ${i === 0 ? "#f97316" : borderColor}` }}>
                      <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {i === 0 && <div style={{ position: "absolute", top: "3px", left: "3px", background: "#f97316", color: "#fff", fontSize: "0.55rem", fontWeight: 800, padding: "2px 5px", borderRadius: "4px" }}>MAIN</div>}
                      <button type="button" onClick={() => removeImage(i)} style={{ position: "absolute", top: "3px", right: "3px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Single Room - Njiro Center" style={inp("title")} />
              {errors.title && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.title}</span>}
            </div>

            {/* Price + City */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Bei ya Mwezi (Tsh) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 80000" style={inp("price")} />
                {errors.price && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.price}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Mji *</label>
                <select name="city" value={form.city} onChange={handleChange} style={inp("city")}>
                  <option value="">Chagua mji...</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.city}</span>}
              </div>
            </div>

            {/* Location */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Eneo / Mtaa *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Njiro, karibu na Shoprite" style={inp("location")} />
              {errors.location && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.location}</span>}
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Maelezo</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Elezea chumba chako — amenities, sheria, nk..." rows={4} style={{ padding: "0.875rem 1rem", borderRadius: "10px", border: `1.5px solid ${borderColor}`, fontSize: "0.9rem", color: textPrimary, background: inputBg, resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, outline: "none" }} />
            </div>

            {/* Phone */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Nambari ya Simu *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0754123456" style={inp("phone")} />
              {errors.phone && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.phone}</span>}
              <span style={{ color: textSecondary, fontSize: "0.75rem" }}>📞 Namba itafichwa mpaka tenant alipe 10,000 Tsh</span>
            </div>

            <button type="submit" disabled={loading || uploadingImg} style={{ background: loading ? "#888" : "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" }}>
              {loading ? (
                <><span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Inachapisha...</>
              ) : "🏠 Chapisha Tangazo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
