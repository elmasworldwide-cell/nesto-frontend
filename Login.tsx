import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, saveAuth } from "../services/authService";
import { useApp } from "../context/AppContext";

// Exact same logo as Navbar
function LokestaLogo({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#0f1923"/>
      <path d="M50 8 C30 8 14 24 14 44 C14 64 50 92 50 92 C50 92 86 64 86 44 C86 24 70 8 50 8Z" fill="url(#pinLogin)"/>
      <path d="M28 46 L50 28 L72 46" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="43" y="35" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="51" y="35" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="43" y="42" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="51" y="42" width="6" height="5" rx="1" fill="white" opacity="0.9"/>
      <circle cx="50" cy="68" r="6" fill="#0f1923" opacity="0.5"/>
      <circle cx="50" cy="68" r="3" fill="white" opacity="0.6"/>
      <defs>
        <linearGradient id="pinLogin" x1="14" y1="8" x2="86" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="45%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const dark = theme === "dark";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#ffffff";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) { setError("Weka email yako"); return; }
    if (!form.password) { setError("Weka password yako"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form);
      saveAuth(data);
      navigate("/");
    } catch (err: unknown) {
      const e = err as any;
      const status = e?.response?.status;
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message;
      if (status === 401 || status === 403) {
        setError("Email au password si sahihi — jaribu tena");
      } else if (status === 404) {
        setError("Account haipatikani — jisajili kwanza");
      } else if (status === 0 || e?.code === "ERR_NETWORK") {
        setError("Hakuna mtandao — angalia internet yako");
      } else {
        setError(msg || "Login imeshindwa — jaribu tena baadaye");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse: { credential?: string }) => {
    try {
      const base64 = credentialResponse.credential?.split(".")[1] || "";
      const decoded = JSON.parse(atob(base64));
      saveAuth({
        message: "Umeingia!",
        token: credentialResponse.credential || "",
        user: { id: 999, name: decoded.name || "Google User", email: decoded.email || "" }
      });
      navigate("/");
    } catch {
      setError("Google login imeshindwa — jaribu tena");
    }
  };

  const inp: React.CSSProperties = {
    padding: "0.875rem 1rem", borderRadius: "10px",
    border: `1.5px solid ${borderColor}`, fontSize: "0.9rem",
    color: textPrimary, background: inputBg,
    fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0f1923 0%, #1a2a3a 100%)", display: "flex", alignItems: "stretch" }}>

      {/* Left — Branding */}
      <div className="login-left-panel" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "360px" }}>
          {/* Logo — identical to navbar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem", marginBottom: "2.5rem" }}>
            <LokestaLogo size={80} />
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "0.02em", fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                <span style={{ color: "#fff" }}>Loce</span>
                <span style={{ color: "#f97316" }}>sta</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "4px" }}>
                — Find your place anywhere —
              </p>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", color: "#fff", lineHeight: 1.3, marginBottom: "1rem" }}>
            Tanzania's #1 Room Rental Platform
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Tafuta chumba chako kote Tanzania. Wasiliana moja kwa moja na wamiliki.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", textAlign: "left" }}>
            {[
              { icon: "🔍", text: "Browse thousands of verified rooms" },
              { icon: "🔓", text: "Unlock owner contact — 10,000 Tsh" },
              { icon: "🏠", text: "List your property for free" },
              { icon: "🇹🇿", text: "M-Pesa, Airtel, Tigo & more" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0 }}>{item.icon}</div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="login-right-panel" style={{ width: "440px", background: cardBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem" }}>
        <div style={{ width: "100%", maxWidth: "340px" }}>

          {/* Mobile logo — same as navbar */}
          <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }} className="mobile-logo">
            <LokestaLogo size={52} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: textPrimary }}>Loce</span>
                <span style={{ color: "#f97316" }}>sta</span>
              </div>
              <p style={{ color: textSecondary, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Find your place anywhere</p>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: textPrimary, marginBottom: "0.35rem" }}>Welcome back 👋</h1>
          <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.75rem" }}>Sign in to your Lokesta account</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError("Google login imeshindwa")}
              theme={dark ? "filled_black" : "outline"}
              shape="rectangular"
              width="100%"
              text="signin_with"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
            <span style={{ flex: 1, height: "1px", background: borderColor, display: "block" }} />
            <span style={{ color: textSecondary, fontSize: "0.75rem" }}>au ingia na email</span>
            <span style={{ flex: 1, height: "1px", background: borderColor, display: "block" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="samwel@example.com" style={inp} autoComplete="email" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" style={{ ...inp, paddingRight: "3rem" }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: textSecondary, fontSize: "1rem" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: loading ? "#888" : "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.75 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Inaingia...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: textSecondary, fontSize: "0.875rem", marginTop: "1.25rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#f97316", fontWeight: 700 }}>Create account</Link>
          </p>

          <div style={{ marginTop: "1.25rem", padding: "0.875rem 1rem", background: dark ? "rgba(255,255,255,0.04)" : "#f8f4ed", borderRadius: "10px", border: `1px solid ${borderColor}` }}>
            <p style={{ color: textSecondary, fontSize: "0.72rem", marginBottom: "0.5rem", fontWeight: 600 }}>🧪 Demo Credentials</p>
            <button onClick={() => setForm({ email: "samwel@nesto.co.tz", password: "password123" })} style={{ width: "100%", background: "transparent", border: `1px solid ${borderColor}`, borderRadius: "8px", padding: "0.6rem", color: textSecondary, fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
