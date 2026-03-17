import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

type PaymentMethod = "card" | "mpesa" | "airtel" | "tigo" | "halo" | "nmb" | "crdb";

const networks = [
  {
    id: "mpesa" as PaymentMethod,
    name: "M-Pesa",
    provider: "Vodacom",
    color: "#E31837",
    lightColor: "#fef2f4",
    logo: "📱",
    prefix: "0744, 0745, 0746",
  },
  {
    id: "airtel" as PaymentMethod,
    name: "Airtel Money",
    provider: "Airtel Tanzania",
    color: "#FF0000",
    lightColor: "#fff5f5",
    logo: "📲",
    prefix: "0784, 0785, 0786",
  },
  {
    id: "tigo" as PaymentMethod,
    name: "Tigo Pesa",
    provider: "Tigo Tanzania",
    color: "#0066CC",
    lightColor: "#eff6ff",
    logo: "💙",
    prefix: "0713, 0714, 0715",
  },
  {
    id: "halo" as PaymentMethod,
    name: "Halopesa",
    provider: "TTCL",
    color: "#00A651",
    lightColor: "#f0fdf4",
    logo: "💚",
    prefix: "0616, 0617",
  },
  {
    id: "nmb" as PaymentMethod,
    name: "NMB Mobile",
    provider: "NMB Bank",
    color: "#FF6600",
    lightColor: "#fff7ed",
    logo: "🏦",
    prefix: "NMB Account",
  },
  {
    id: "crdb" as PaymentMethod,
    name: "CRDB Tembo",
    provider: "CRDB Bank",
    color: "#006B3C",
    lightColor: "#f0fdf4",
    logo: "🐘",
    prefix: "CRDB Account",
  },
];

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useApp();
  const dark = theme === "dark";

  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"method" | "details" | "confirm">("method");

  // Theme
  const bg = dark ? "#0f1923" : "#f8f4ed";
  const cardBg = dark ? "#1a2a3a" : "#ffffff";
  const textPrimary = dark ? "#f8f4ed" : "#0f1923";
  const textSecondary = dark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "#e5e0d8";
  const inputBg = dark ? "#0f1923" : "#fdfaf7";

  const selectedNetwork = networks.find((n) => n.id === method);

  // Amount — in real app this comes from room price
  const amount = "80,000 Tsh";
  const amountNum = 80000;

  const formatCard = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
  };

  const handlePay = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 4000);
  };

  // Success screen
  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: cardBg, borderRadius: "24px", padding: "3rem", maxWidth: "420px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
          <div style={s.successCircle}>✓</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: textPrimary, marginBottom: "0.75rem" }}>
            Congratulations! 🎉
          </h2>
          <p style={{ color: "#059669", fontWeight: 600, fontSize: "1rem", marginBottom: "0.5rem" }}>
            Your payment was successful!
          </p>
          <p style={{ color: textSecondary, fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Malipo yako ya <strong style={{ color: "#c9a84c" }}>{amount}</strong> yamekamilika.
            Utapata ujumbe wa uthibitisho kwenye simu yako.
          </p>
          <div style={s.successDetails}>
            <div style={s.successRow}>
              <span style={{ color: textSecondary, fontSize: "0.82rem" }}>Method</span>
              <span style={{ color: textPrimary, fontWeight: 600, fontSize: "0.82rem" }}>
                {method === "card" ? "💳 Card" : selectedNetwork?.name}
              </span>
            </div>
            <div style={s.successRow}>
              <span style={{ color: textSecondary, fontSize: "0.82rem" }}>Amount</span>
              <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.82rem" }}>{amount}</span>
            </div>
            <div style={s.successRow}>
              <span style={{ color: textSecondary, fontSize: "0.82rem" }}>Status</span>
              <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.82rem" }}>✓ Confirmed</span>
            </div>
          </div>
          <p style={{ color: textSecondary, fontSize: "0.78rem", marginTop: "1.5rem" }}>
            Unahamishwa Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "background 0.3s" }}>
      {/* Header */}
      <div style={{ background: "#0f1923", padding: "1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "#c9a84c", fontSize: "0.875rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            ← Back
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.4rem" }}>
            Malipo / Payment
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Amount card */}
        <div style={{ background: "#0f1923", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "4px" }}>Total Amount</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#c9a84c", fontWeight: 700 }}>{amount}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Room deposit + first month</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "4px" }}>Room ID</p>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>#{id || "001"}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Single Room - Njiro</p>
          </div>
        </div>

        {/* Payment method selector */}
        <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${borderColor}` }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: textPrimary, marginBottom: "1.25rem" }}>
            Chagua Njia ya Malipo
          </h2>

          {/* Card option */}
          <div
            onClick={() => setMethod("card")}
            style={{
              ...s.methodCard,
              border: method === "card" ? "2px solid #c9a84c" : `1.5px solid ${borderColor}`,
              background: method === "card" ? (dark ? "rgba(201,168,76,0.1)" : "#fffbf0") : inputBg,
              marginBottom: "0.75rem",
              cursor: "pointer",
            }}
          >
            <div style={{ ...s.methodIcon, background: "#f0f0f0" }}>💳</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: textPrimary, fontSize: "0.9rem" }}>Credit / Debit Card</p>
              <p style={{ color: textSecondary, fontSize: "0.75rem" }}>Visa, Mastercard, American Express</p>
            </div>
            <div style={{ ...s.radioCircle, borderColor: method === "card" ? "#c9a84c" : borderColor }}>
              {method === "card" && <div style={s.radioDot} />}
            </div>
          </div>

          {/* Mobile money options */}
          <p style={{ color: textSecondary, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "1rem 0 0.75rem" }}>
            Mobile Money — Tanzania
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {networks.map((network) => (
              <div
                key={network.id}
                onClick={() => setMethod(network.id)}
                style={{
                  ...s.methodCard,
                  border: method === network.id ? `2px solid ${network.color}` : `1.5px solid ${borderColor}`,
                  background: method === network.id ? (dark ? `${network.color}20` : network.lightColor) : inputBg,
                  cursor: "pointer",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "1rem",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: "1.5rem" }}>{network.logo}</span>
                  <div style={{ ...s.radioCircle, borderColor: method === network.id ? network.color : borderColor }}>
                    {method === network.id && <div style={{ ...s.radioDot, background: network.color }} />}
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: method === network.id ? network.color : textPrimary, fontSize: "0.88rem" }}>
                    {network.name}
                  </p>
                  <p style={{ color: textSecondary, fontSize: "0.7rem" }}>{network.provider}</p>
                  <p style={{ color: textSecondary, fontSize: "0.68rem", marginTop: "2px" }}>{network.prefix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div style={{ background: cardBg, borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${borderColor}` }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: textPrimary, marginBottom: "1.25rem" }}>
            {method === "card" ? "Card Details" : `${selectedNetwork?.name} Details`}
          </h2>

          {/* Card form */}
          {method === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={s.field}>
                <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{ ...s.input, background: inputBg, borderColor, color: textPrimary }}
                />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="SAMWEL MWANGI"
                  style={{ ...s.input, background: inputBg, borderColor, color: textPrimary }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ ...s.input, background: inputBg, borderColor, color: textPrimary }}
                  />
                </div>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="•••"
                    maxLength={3}
                    style={{ ...s.input, background: inputBg, borderColor, color: textPrimary }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile money form */}
          {method !== "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8f4ed", borderRadius: "12px", padding: "1rem", border: `1px solid ${borderColor}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{selectedNetwork?.logo}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: selectedNetwork?.color, fontSize: "0.9rem" }}>{selectedNetwork?.name}</p>
                    <p style={{ color: textSecondary, fontSize: "0.75rem" }}>{selectedNetwork?.provider}</p>
                  </div>
                </div>
                <p style={{ color: textSecondary, fontSize: "0.78rem", lineHeight: 1.5 }}>
                  Utapata ujumbe wa USSD kwenye simu yako ili kuthibitisha malipo ya <strong style={{ color: selectedNetwork?.color }}>{amount}</strong>
                </p>
              </div>

              <div style={s.field}>
                <label style={{ ...s.label, color: dark ? "rgba(255,255,255,0.7)" : "#374151" }}>
                  Nambari ya Simu ({selectedNetwork?.prefix})
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: textSecondary, fontSize: "0.9rem", fontWeight: 600 }}>
                    +255
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    placeholder="744123456"
                    style={{ ...s.input, background: inputBg, borderColor, color: textPrimary, paddingLeft: "3.5rem" }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f0fdf4", borderRadius: "12px", padding: "1rem", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(5,150,105,0.15)"}` }}>
                <p style={{ color: dark ? "rgba(255,255,255,0.6)" : "#065f46", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                  Hatua za Malipo:
                </p>
                {[
                  `1. Weka nambari yako ya ${selectedNetwork?.name}`,
                  "2. Click 'Lipa Sasa' hapa chini",
                  "3. Subiri ujumbe wa USSD kwenye simu yako",
                  "4. Ingiza PIN yako ya mobile money",
                  "5. Utapata uthibitisho wa malipo",
                ].map((step, i) => (
                  <p key={i} style={{ color: dark ? "rgba(255,255,255,0.5)" : "#047857", fontSize: "0.75rem", lineHeight: 1.8 }}>
                    {step}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading || (method !== "card" && phone.length < 9) || (method === "card" && (cardNumber.length < 19 || !cardName || expiry.length < 5 || cvv.length < 3))}
          style={{
            ...s.payBtn,
            background: loading ? "#888" : (selectedNetwork?.color || "#c9a84c"),
            opacity: loading ? 0.8 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <span style={s.spinner} /> Inachakata Malipo...
            </span>
          ) : (
            `💳 Lipa ${amount} ${method === "card" ? "kwa Card" : `kwa ${selectedNetwork?.name}`}`
          )}
        </button>

        {/* Security notice */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p style={{ color: textSecondary, fontSize: "0.75rem" }}>
            🔒 Malipo yako yanalindwa na encryption ya hali ya juu. NESTO haihifadhi taarifa zako za malipo.
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  methodCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0.875rem 1rem",
    borderRadius: "12px",
    transition: "all 0.2s",
  },
  methodIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    flexShrink: 0,
  },
  radioCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "border-color 0.2s",
  },
  radioDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#c9a84c",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.02em" },
  input: {
    padding: "0.875rem 1rem",
    borderRadius: "10px",
    border: "1.5px solid",
    fontSize: "0.9rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },
  payBtn: {
    width: "100%",
    padding: "1.1rem",
    borderRadius: "14px",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.03em",
    transition: "all 0.2s",
  },
  spinner: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  successCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#059669",
    fontSize: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    fontWeight: 700,
  },
  successDetails: {
    background: "rgba(5,150,105,0.06)",
    borderRadius: "12px",
    padding: "1rem",
    border: "1px solid rgba(5,150,105,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  successRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
