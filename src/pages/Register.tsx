import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveAuth } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Jaza fields zote");
      return;
    }
    if (form.password.length < 6) {
      setError("Password lazima iwe na herufi 6+");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Registration imeshindwa — jaribu tena");
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div style={s.page}>
      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftContent}>
          <Link to="/" style={s.brand}>🏠 NESTO</Link>
          <h2 style={s.leftTitle}>Join 2,400+ Tanzanians on NESTO</h2>
          <div style={s.benefitsList}>
            {[
              { icon: "🔍", text: "Browse hundreds of verified rooms" },
              { icon: "📞", text: "Connect directly with landlords" },
              { icon: "🏠", text: "List your property for free" },
              { icon: "🔖", text: "Save your favourite rooms" },
            ].map((b, i) => (
              <div key={i} style={s.benefit}>
                <span style={s.benefitIcon}>{b.icon}</span>
                <span style={s.benefitText}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={s.rightPanel}>
        <div style={s.formWrap}>
          <h1 style={s.title}>Create account</h1>
          <p style={s.subtitle}>Join NESTO and find your perfect space</p>

          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Samwel Mwangi" style={s.input} autoComplete="name" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="samwel@example.com" style={s.input} autoComplete="email" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Angalau herufi 6" style={s.input} autoComplete="new-password" />
              {form.password.length > 0 && (
                <div style={s.strengthWrap}>
                  <div style={s.strengthBars}>
                    {[1, 2, 3].map((level) => (
                      <div key={level} style={{ ...s.strengthBar, background: strength >= level ? strengthColors[strength] : "#e5e0d8" }} />
                    ))}
                  </div>
                  <span style={{ ...s.strengthLabel, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Inaunda akaunti..." : "Create Account →"}
            </button>
          </form>

          <p style={s.switchText}>
            Una akaunti tayari?{" "}
            <Link to="/login" style={s.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex" },
  leftPanel: { flex: 1, background: "#0f1923", padding: "3rem", display: "flex", alignItems: "center", justifyContent: "center" },
  leftContent: { maxWidth: "400px", display: "flex", flexDirection: "column", gap: "2rem" },
  brand: { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#c9a84c", letterSpacing: "0.1em", fontWeight: 700 },
  leftTitle: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", lineHeight: 1.25 },
  benefitsList: { display: "flex", flexDirection: "column", gap: "1rem" },
  benefit: { display: "flex", alignItems: "center", gap: "12px" },
  benefitIcon: { width: "40px", height: "40px", background: "rgba(201,168,76,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 } as React.CSSProperties,
  benefitText: { color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" },
  rightPanel: { width: "480px", background: "#f8f4ed", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem" },
  formWrap: { width: "100%", maxWidth: "380px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#0f1923", marginBottom: "0.4rem" },
  subtitle: { color: "#6b7280", fontSize: "0.9rem", marginBottom: "2rem" },
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem" },
  form: { display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#374151", letterSpacing: "0.02em" },
  input: { padding: "0.875rem 1rem", borderRadius: "10px", border: "1.5px solid #e5e0d8", fontSize: "0.9rem", color: "#0f1923", background: "#fff", fontFamily: "'DM Sans', sans-serif", outline: "none" },
  strengthWrap: { display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" },
  strengthBars: { display: "flex", gap: "4px", flex: 1 },
  strengthBar: { flex: 1, height: "4px", borderRadius: "2px", transition: "background 0.3s" },
  strengthLabel: { fontSize: "0.75rem", fontWeight: 600, minWidth: "40px" },
  submitBtn: { background: "#b85c38", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em", transition: "all 0.2s" },
  switchText: { textAlign: "center", color: "#6b7280", fontSize: "0.875rem" },
  switchLink: { color: "#b85c38", fontWeight: 600 },
};
