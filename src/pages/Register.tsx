import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser, saveAuth } from "../services/authService";
import { useApp } from "../context/AppContext";
import { LOKESTALogoBig, LOKESTALogo } from "../components/LOKESTALogo";

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
    if (!form.name.trim()) { setError("Weka jina lako kamili"); return; }
    if (!form.email.trim()) { setError("Weka email yako"); return; }
    if (!form.password) { setError("Weka password"); return; }
    if (form.password.length < 6) { setError("Password iwe na herufi 6+"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      saveAuth(data);
      navigate("/");
    } catch (err: unknown) {
      const e = err as any;
      const status = e?.response?.status;
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || "";
      if (status === 409 || msg.toLowerCase().includes("exist") || msg.toLowerCase().includes("already")) {
        setError("Email hii imeshatumika — ingia badala yake");
      } else if (status === 400) {
        setError(msg || "Taarifa si sahihi — angalia tena");
      } else if (e?.code === "ERR_NETWORK") {
        setError("Hakuna mtandao — angalia internet yako");
      } else if (status >= 500) {
        setError("Tatizo la seva — jaribu tena baadaye");
      } else {
        setError(msg || "Registration imeshindwa — jaribu tena");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (cr: { credential?: string }) => {
    try {
      const decoded = JSON.parse(atob((cr.credential?.split(".")[1]) || "{}"));
      saveAuth({
        message: "OK",
        token: cr.credential || "",
        user: { id: 999, name: decoded.name || "Google User", email: decoded.email || "" },
      });
      navigate("/");
    } catch { setError("Google login imeshindwa"); }
  };

  const inp: React.CSSProperties = {
    padding: "0.875rem 1rem", borderRadius: "10px",
    border: `1.5px solid ${borderColor}`, fontSize: "0.9rem",
    color: textPrimary, background: inputBg,
    fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg,#0d1b2a 0%,#1a2a3a 100%)", display: "flex", alignItems: "stretch" }}>

      {/* LEFT */}
      <div className="login-left-panel" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "380px" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <LOKESTALogoBig size={100} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.9rem", color: "#fff", lineHeight: 1.3, marginBottom: "1rem" }}>
            Join 2,400+ Tanzanians on LOKESTA
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

      {/* RIGHT */}
      <div className="login-right-panel" style={{ width: "440px", background: cardBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2.5rem" }}>
        <div style={{ width: "100%", maxWidth: "340px" }}>

          {/* Mobile logo */}
          <div style={{ display: "none", justifyContent: "center", marginBottom: "2rem" }} className="mobile-logo">
            <LOKESTALogo size={36} showText={true} />
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: textPrimary, marginBottom: "0.35rem" }}>
            Create account 🎉
          </h1>
          <p style={{ color: textSecondary, fontSize: "0.875rem", marginBottom: "1.75rem" }}>
            Join LOKESTA and find your perfect space
          </p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.875rem 1rem", borderRadius: "10px", fontSize: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <div>
                <span>{error}</span>
                {error.includes("imeshatumika") && (
                  <div style={{ marginTop: "4px" }}>
                    <Link to="/login" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "underline", fontSize: "0.82rem" }}>→ Ingia sasa</Link>
                  </div>
                )}
              </div>
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                    {[1, 2, 3].map((level) => (
                      <div key={level} style={{ flex: 1, height: "4px", borderRadius: "2px", background: strength >= level ? strengthColors[strength] : borderColor, transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: strengthColors[strength], minWidth: "32px" }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ background: loading ? "#888" : "linear-gradient(135deg,#f97316,#fbbf24)", color: "#fff", border: "none", borderRadius: "12px", padding: "1rem", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.75 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Inaunda akaunti...
                </span>
              ) : "Create Account →"}
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
