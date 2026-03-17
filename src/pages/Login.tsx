import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, saveAuth } from "../services/authService";
import { useApp } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { theme, t } = useApp();
  const dark = theme === "dark";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Jaza email na password");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Login imeshindwa — jaribu tena");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      // Decode Google JWT to get user info
      const base64 = credentialResponse.credential?.split(".")[1] || "";
      const decoded = JSON.parse(atob(base64));

      // Save mock auth (in production, send to backend to verify)
      const mockAuth = {
        message: "Umeingia!",
        token: credentialResponse.credential || "",
        user: {
          id: 999,
          name: decoded.name || "Google User",
          email: decoded.email || "",
        },
      };
      saveAuth(mockAuth);
      navigate("/dashboard");
    } catch {
      setError("Google login imeshindwa — jaribu tena");
    }
  };

  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const inputBg = dark ? "#0f1923" : "#ffffff";
  const inputBorder = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";
  const textColor = dark ? "#f8f4ed" : "#0f1923";
  const subtitleColor = dark ? "rgba(255,255,255,0.5)" : "#6b7280";

  return (
    <div style={{ ...s.page, background: dark ? "#0f1923" : "#f8f4ed" }}>
      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftContent}>
          <Link to="/" style={s.brand}>🏠 NESTO</Link>
          <h2 style={s.leftTitle}>Tanzania's Smartest Room Rental Platform</h2>
          <p style={s.leftText}>Join thousands finding their perfect room across Tanzania.</p>
          <div style={s.testimonial}>
            <p style={s.testimonialText}>"Nilipata chumba Arusha kwa siku mbili tu kupitia NESTO. Rahisi sana!"</p>
            <p style={s.testimonialAuthor}>— Amina J., Arusha</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ ...s.rightPanel, background: dark ? "#0a1018" : "#f8f4ed" }}>
        <div style={s.formWrap}>
          <h1 style={{ ...s.title, color: textColor }}>{t("login.title")}</h1>
          <p style={{ ...s.subtitle, color: subtitleColor }}>{t("login.subtitle")}</p>

          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          {/* Google Login */}
          <div style={s.googleWrap}>
            <p style={{ ...s.orText, color: subtitleColor }}>{t("login.orGoogle")}</p>
            <div style={s.googleBtn}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login imeshindwa")}
                theme={dark ? "filled_black" : "outline"}
                shape="rectangular"
                width="100%"
                text="signin_with"
              />
            </div>
          </div>

          <div style={s.divider}>
            <span style={{ ...s.dividerLine, background: inputBorder }} />
            <span style={{ ...s.dividerText, color: subtitleColor }}>au</span>
            <span style={{ ...s.dividerLine, background: inputBorder }} />
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>
                {t("login.email")}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="samwel@example.com"
                style={{ ...s.input, background: inputBg, borderColor: inputBorder, color: textColor }}
                autoComplete="email"
              />
            </div>
            <div style={s.field}>
              <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>
                {t("login.password")}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ ...s.input, background: inputBg, borderColor: inputBorder, color: textColor }}
                autoComplete="current-password"
              />
            </div>

            <Link to="/reset-password" style={{ ...s.forgotLink, color: "#c9a84c" }}>
              Forgot password?
            </Link>

            <button
              type="submit"
              style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? t("login.loading") : t("login.btn")}
            </button>
          </form>

          <p style={{ ...s.switchText, color: subtitleColor }}>
            {t("login.noAccount")}{" "}
            <Link to="/register" style={{ color: "#b85c38", fontWeight: 600 }}>
              {t("login.createAccount")}
            </Link>
          </p>

          <button
            onClick={() => setForm({ email: "samwel@nesto.co.tz", password: "password123" })}
            style={{ ...s.demoBtn, background: dark ? "rgba(255,255,255,0.06)" : "transparent", borderColor: inputBorder, color: dark ? "rgba(255,255,255,0.6)" : "#374151" }}
          >
            {t("login.demo")}
          </button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex" },
  leftPanel: { flex: 1, background: "#0f1923", padding: "3rem", display: "flex", alignItems: "center", justifyContent: "center" },
  leftContent: { maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" },
  brand: { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#c9a84c", letterSpacing: "0.1em", fontWeight: 700 },
  leftTitle: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", lineHeight: 1.25 },
  leftText: { color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7 },
  testimonial: { marginTop: "1rem", borderLeft: "3px solid #c9a84c", paddingLeft: "1rem" },
  testimonialText: { color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", fontStyle: "italic", lineHeight: 1.6, marginBottom: "0.5rem" },
  testimonialAuthor: { color: "#c9a84c", fontSize: "0.8rem", fontWeight: 600 },
  rightPanel: { width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem" },
  formWrap: { width: "100%", maxWidth: "380px" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "0.4rem" },
  subtitle: { fontSize: "0.9rem", marginBottom: "1.5rem" },
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1rem" },
  googleWrap: { marginBottom: "0.75rem" },
  orText: { fontSize: "0.78rem", textAlign: "center", marginBottom: "0.75rem" },
  googleBtn: { display: "flex", justifyContent: "center" },
  divider: { display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" },
  dividerLine: { flex: 1, height: "1px", display: "block" },
  dividerText: { fontSize: "0.78rem", whiteSpace: "nowrap" },
  form: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.02em" },
  input: { padding: "0.875rem 1rem", borderRadius: "10px", border: "1.5px solid", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.2s" },
  forgotLink: { fontSize: "0.8rem", fontWeight: 500, textAlign: "right", textDecoration: "none" },
  submitBtn: { background: "#0f1923", color: "#c9a84c", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em", transition: "all 0.2s" },
  switchText: { textAlign: "center", fontSize: "0.875rem", marginBottom: "0.75rem" },
  demoBtn: { width: "100%", border: "1.5px solid", borderRadius: "10px", padding: "0.75rem", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};
