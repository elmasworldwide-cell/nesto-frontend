import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createRoom } from "../services/roomsService";
import { isLoggedIn } from "../services/authService";

export default function AddProperty() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    location: "",
    description: "",
    phone: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const cities = ["Arusha", "Dar es Salaam", "Moshi", "Zanzibar", "Dodoma", "Mwanza", "Tanga", "Other"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title inahitajika";
    if (!form.price.trim()) newErrors.price = "Price inahitajika";
    if (!form.city) newErrors.city = "Chagua mji";
    if (!form.location.trim()) newErrors.location = "Location inahitajika";
    if (!form.phone.trim()) newErrors.phone = "Phone inahitajika";
    if (form.phone && !/^0[67]\d{8}$/.test(form.phone)) {
      newErrors.phone = "Namba si sahihi (mfano: 0754123456)";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      if (isLoggedIn()) {
        // Save to backend
        await createRoom({
          title: form.title,
          description: form.description,
          price: parseInt(form.price),
          location: form.location,
          city: form.city,
          images: form.image ? [form.image] : [],
        });
      } else {
        // Save to localStorage if not logged in
        const existing = JSON.parse(localStorage.getItem("nesto_rooms") || "[]");
        existing.push({
          ...form,
          id: Date.now(),
          price: parseInt(form.price),
          images: [{ id: 1, url: form.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" }],
          owner: { id: 0, name: "You", email: "" },
          ownerId: 0,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("nesto_rooms", JSON.stringify(existing));
      }

      setSubmitted(true);
      setTimeout(() => navigate("/rooms"), 2500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (msg === "Hakuna ruhusa — ingia kwanza") {
        setApiError("Ingia kwanza ili kuweka chumba kwenye database");
      } else {
        setApiError(msg || "Hitilafu imetokea — jaribu tena");
      }
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={s.successPage}>
        <div style={s.successCard}>
          <div style={{ fontSize: "3.5rem" }}>🎉</div>
          <h2 style={s.successTitle}>Chumba Kimewekwa!</h2>
          <p style={s.successText}>"{form.title}" imewekwa kwenye NESTO.</p>
          <div style={s.loaderWrap}><div style={s.loaderBar} /></div>
          <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Unahamishwa...</p>
        </div>
      </div>
    );
  }

  const inputStyle = (field: string) => ({
    ...s.input,
    ...(errors[field] ? s.inputError : {}),
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerContent}>
          <h1 style={s.title}>List Your Property</h1>
          <p style={s.subtitle}>Reach thousands of tenants across Tanzania — for free</p>
          {!isLoggedIn() && (
            <div style={s.loginNotice}>
              ⚠️ <Link to="/login" style={{ color: "#c9a84c", fontWeight: 600 }}>Login</Link> ili chumba chako kihifadhiwe kwenye database ya kweli
            </div>
          )}
        </div>
      </div>

      <div style={s.container}>
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <span style={s.formBadge}>🏠 New Listing</span>
            <p style={s.formSubtitle}>Fields zenye * zinahitajika</p>
          </div>

          {apiError && <div style={s.apiError}>⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Single Room - Njiro Center" style={inputStyle("title")} />
              {errors.title && <span style={s.errorMsg}>{errors.title}</span>}
            </div>

            <div style={s.row}>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.label}>Monthly Price (Tsh) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 80000" style={inputStyle("price")} />
                {errors.price && <span style={s.errorMsg}>{errors.price}</span>}
              </div>
              <div style={{ ...s.fieldGroup, flex: 1 }}>
                <label style={s.label}>City *</label>
                <select name="city" value={form.city} onChange={handleChange} style={inputStyle("city")}>
                  <option value="">Select city...</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <span style={s.errorMsg}>{errors.city}</span>}
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Specific Location / Street *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Njiro, near Shoprite" style={inputStyle("location")} />
              {errors.location && <span style={s.errorMsg}>{errors.location}</span>}
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your property..." rows={4} style={s.textarea} />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Your Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0754123456" style={inputStyle("phone")} />
              {errors.phone && <span style={s.errorMsg}>{errors.phone}</span>}
              <span style={s.hint}>📞 Phone itafichwa mpaka tenant aombe</span>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Photo URL (optional)</label>
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://... (paste image link)" style={s.input} />
              {form.image && (
                <img src={form.image} alt="preview" style={s.preview} onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
            </div>

            <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Inaweka..." : "🏠 Publish Property Listing"}
            </button>
          </form>
        </div>

        {/* Tips sidebar */}
        <div style={s.tips}>
          <h3 style={s.tipsTitle}>💡 Tips</h3>
          {[
            { icon: "📸", tip: "Ongeza picha nzuri" },
            { icon: "📍", tip: "Weka location sahihi" },
            { icon: "💰", tip: "Bei ya soko" },
            { icon: "📝", tip: "Eleza amenities" },
            { icon: "📞", tip: "Simu iwe on" },
          ].map((t, i) => (
            <div key={i} style={s.tip}>
              <span style={{ fontSize: "1.2rem" }}>{t.icon}</span>
              <span style={s.tipText}>{t.tip}</span>
            </div>
          ))}

          {!isLoggedIn() && (
            <div style={s.loginTip}>
              <p style={{ color: "#c9a84c", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                🔑 Ingia ili:
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.5 }}>
                • Chumba chako kionekane kwa wote<br />
                • Manage listings yako<br />
                • Pokea maombi ya wapangaji
              </p>
              <Link to="/login" style={s.loginTipBtn}>Login Sasa</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f8f4ed" },
  header: { background: "#0f1923", padding: "3rem 1.5rem" },
  headerContent: { maxWidth: "1000px", margin: "0 auto" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#fff", marginBottom: "0.5rem" },
  subtitle: { color: "#c9a84c", fontSize: "1rem", marginBottom: "0.75rem" },
  loginNotice: { display: "inline-block", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: "8px", fontSize: "0.82rem" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 260px", gap: "2rem", alignItems: "start" },
  formCard: { background: "#fff", borderRadius: "20px", padding: "2rem", boxShadow: "0 4px 30px rgba(0,0,0,0.08)" },
  formHeader: { marginBottom: "1.75rem" },
  formBadge: { display: "inline-block", background: "#f8f4ed", color: "#0f1923", fontSize: "0.82rem", fontWeight: 600, padding: "6px 14px", borderRadius: "20px", marginBottom: "0.75rem" },
  formSubtitle: { color: "#6b7280", fontSize: "0.875rem" },
  apiError: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  row: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  label: { fontSize: "0.85rem", fontWeight: 600, color: "#374151", letterSpacing: "0.02em" },
  input: { padding: "0.875rem 1rem", borderRadius: "10px", border: "1.5px solid #e5e0d8", fontSize: "0.9rem", color: "#0f1923", background: "#fdfaf7", width: "100%", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  inputError: { borderColor: "#ef4444", background: "#fff8f8" },
  textarea: { padding: "0.875rem 1rem", borderRadius: "10px", border: "1.5px solid #e5e0d8", fontSize: "0.9rem", color: "#0f1923", background: "#fdfaf7", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, outline: "none" },
  errorMsg: { color: "#ef4444", fontSize: "0.78rem" },
  hint: { color: "#9ca3af", fontSize: "0.78rem" },
  preview: { width: "100%", height: "160px", objectFit: "cover", borderRadius: "10px", marginTop: "4px" },
  submitBtn: { background: "#0f1923", color: "#c9a84c", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", marginTop: "0.5rem" },
  tips: { background: "#0f1923", borderRadius: "20px", padding: "1.75rem", position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "1rem" },
  tipsTitle: { fontFamily: "'Playfair Display', serif", color: "#c9a84c", fontSize: "1.1rem", marginBottom: "0.25rem" },
  tip: { display: "flex", alignItems: "center", gap: "10px" },
  tipText: { color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.4 },
  loginTip: { marginTop: "0.5rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "12px", padding: "1rem" },
  loginTipBtn: { display: "block", textAlign: "center", marginTop: "0.75rem", background: "#c9a84c", color: "#0f1923", padding: "8px", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem" },
  successPage: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f4ed", padding: "2rem" },
  successCard: { background: "#fff", borderRadius: "24px", padding: "3rem", textAlign: "center", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
  successTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#0f1923" },
  successText: { color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 },
  loaderWrap: { width: "100%", height: "4px", background: "#f3f4f6", borderRadius: "2px", overflow: "hidden" },
  loaderBar: { height: "100%", width: "100%", background: "#c9a84c", animation: "shimmer 2.5s linear" },
};
