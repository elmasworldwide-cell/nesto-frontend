import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, saveAuth } from "../services/authService";
import { useApp } from "../context/AppContext";

interface LokestalLogoProps {
  size?: number;
}

function LokestalLogo({ size = 120 }: LokestalLogoProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: "20px",
      }}
    >
      <img
        src="/logo.png"
        alt="Locesta Logo"
        width={size}
        style={{
          height: "auto",
          objectFit: "contain",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          transition: "transform 0.3s ease",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
    </div>
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

    if (!form.email || !form.password) {
      setError("Jaza email na password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(form);
      saveAuth(data);
      navigate("/");
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      setError(msg || "Login imeshindwa — jaribu tena");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse: any) => {
    try {
      const token = credentialResponse?.credential;

      if (!token) throw new Error("No token");

      const base64 = token.split(".")[1];
      const decoded = JSON.parse(atob(base64));

      saveAuth({
        message: "Umeingia!",
        token,
        user: {
          id: 999,
          name: decoded.name || "Google User",
          email: decoded.email || "",
        },
      });

      navigate("/");
    } catch {
      setError("Google login imeshindwa");
    }
  };

  const inp: React.CSSProperties = {
    padding: "0.875rem 1rem",
    borderRadius: "10px",
    border: `1.5px solid ${borderColor}`,
    fontSize: "0.9rem",
    color: textPrimary,
    background: inputBg,
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0f1923 0%, #1a2a3a 100%)",
        display: "flex",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem",
        }}
      >
        <LokestalLogo size={90} />

        <h1 style={{ color: "#fff", marginTop: 20 }}>Locesta</h1>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          Tanzania Room Rental Platform
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          width: 420,
          background: cardBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 340 }}>
          <h2 style={{ color: textPrimary }}>Welcome back 👋</h2>
          <p style={{ color: textSecondary }}>Sign in to continue</p>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "10px",
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              {error}
            </div>
          )}

          {/* GOOGLE LOGIN */}
          <div style={{ marginTop: 15 }}>
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError("Google login failed")}
            />
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{ ...inp, marginBottom: 10 }}
            />

            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={inp}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 15,
                padding: "10px",
                background: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p style={{ marginTop: 15, color: textSecondary }}>
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
