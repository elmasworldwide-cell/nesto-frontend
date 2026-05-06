import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, saveAuth } from "../services/authService";
import { useApp } from "../context/AppContext";

function LokestalLogo({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="58" fill="#0f1923" stroke="#f97316" strokeWidth="2"/>
      <path d="M60 18 C44 18 30 32 30 48 C30 66 60 102 60 102 C60 102 90 66 90 48 C90 32 76 18 60 18Z" fill="url(#pinReg)"/>
      <path d="M44 50 L60 37 L76 50 L76 66 L66 66 L66 56 L54 56 L54 66 L44 66 Z" fill="white"/>
      <rect x="54" y="56" width="12" height="10" rx="2" fill="#f97316" opacity="0.8"/>
      <rect x="56" y="42" width="8" height="6" rx="1" fill="white" opacity="0.6"/>
      <defs>
        <linearGradient id="pinReg" x1="30" y1="18" x2="90" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const dark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.12)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#ffffff";

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Jaza fields zote"); return; }
    if (form.password.length < 6) { setError("Password lazima iwe na herufi 6+"); return; }
    setLoading(true);
    try {
      const data = await registerUser(form);
      saveAuth(data);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.error;
      setError(msg || "Registration imeshindwa — jaribu tena");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse: { credential?: string }) => {
    try {
      const base64 = credentialResponse.credential?.split(".")[1] || "";
      const decoded = JSON.parse(atob(base64));
      saveAuth({ message: "Umeingia!", token: credentialResponse.credential || "", user: { id: 999, name: decoded.name || "Google User", email: decoded.email || "" } });
      navigate("/");
    } catch { setError("Google login imeshindwa"); }
  };

  const inp: React.CSSProperties = { padding: "0.875rem 1rem", borderRadius: "10px", border: `1.5px solid ${borderColor}`, fontSize: "0.9rem", color: textPrimary, background: inputBg, fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0f1923 0%, #1a2a3a 100%)", display: "flex", alignItems: "stretch" }}>

      {/* Left panel */}
      <div className="login-left-panel" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "360px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
            <LokestalLogo size={80} />
            <div>
              <div style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: "#fff" }}>Loce</span><span style={{ color: "#f97316" }}>sta</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Find your place anywhere</p>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", color: "#fff", lineHeight: 1.3, marginBottom: "1rem" }}>
            Join 2,400+ Tanzanians on Locesta
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Jiunge bila malipo. Tafuta au weka chumba kwa urahisi.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", textAlign: "left" }}>
            {[
              { icon: "🔍", text: "Browse hundreds of verified rooms" },
              { icon: "📞", text: "Connect directly with landlords" },
              { icon: "🏠", text: "List your property for free" },
              { icon: "🔖", text: "Save your favourite rooms" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0 }}>{item.icon}</div>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right-panel" style={{ width: "440px", background: cardBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem" }}>
        <div style={{ width: "100%", maxWidth: "340px" }}>

          {/* Mobile logo */}
          <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }} className="mobile-logo">
            <LokestalLogo size={52} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: textPrimary }}>Loce</span><span style={{ color: "#f97316" }}>sta</span>
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: textPrimary, marginBottom: "0.35rem" }}>Create account 🎉</h1>
          <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.75rem" }}>Join Locesta and find your perfect space</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <GoogleLogin onSuccess={handleGoogle} onError={() => setError("Google login imeshindwa")} theme={dark ? "filled_black" : "outline"} shape="rectangular" width="100%" text="signup_with" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
            <span style={{ flex: 1, height: "1px", background: borderColor, display: "block" }} />
            <span style={{ color: textSecondary, fontSize: "0.75rem" }}>au jisajili na email</span>
            <span style={{ flex: 1, height: "1px", background: borderColor, display: "block" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Samwel Mwangi" style={inp} autoComplete="name" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="samwel@example.com" style={inp} autoComplete="email" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Angalau herufi 6" style={{ ...inp, paddingRight: "3rem" }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: textSecondary, fontSize: "1rem" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                  <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                    {[1, 2, 3].map((level) => (
                      <div key={level} style={{ flex: 1, height: "4px", borderRadius: "2px", background: strength >= level ? strengthColors[strength] : borderColor, transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: strengthColors[strength], minWidth: "32px" }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ background: loading ? "#888" : "linear-gradient(135deg, #f97316, #fbbf24)", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Inaunda akaunti..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: textSecondary, fontSize: "0.875rem", marginTop: "1.25rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#f97316", fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
