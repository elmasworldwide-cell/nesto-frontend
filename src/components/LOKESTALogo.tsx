// LOKESTALogo.tsx — Exact match to brand image
// Pin with white+orange buildings, orange L letter, LOKESTA text white+orange

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function LOKESTAIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 120 132" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── Orange gradient pin ── */}
      <path
        d="M60 4 C33 4 10 27 10 54 C10 85 60 128 60 128 C60 128 110 85 110 54 C110 27 87 4 60 4Z"
        fill="url(#pinG)"
      />
      {/* ── Dark inner background circle ── */}
      <circle cx="60" cy="54" r="40" fill="#0d1b2a" />

      {/* ── White tall building LEFT ── */}
      <rect x="22" y="28" width="16" height="46" rx="2" fill="white" />
      <rect x="25" y="33" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="31" y="33" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="25" y="41" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="31" y="41" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="25" y="49" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="31" y="49" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="25" y="57" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />
      <rect x="31" y="57" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.5" />

      {/* ── Orange tall building RIGHT ── */}
      <rect x="82" y="25" width="16" height="49" rx="2" fill="#f97316" />
      <rect x="85" y="30" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="91" y="30" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="85" y="38" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="91" y="38" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="85" y="46" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="91" y="46" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="85" y="54" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />
      <rect x="91" y="54" width="4" height="4" rx="0.5" fill="#0d1b2a" opacity="0.4" />

      {/* ── Small house bottom center ── */}
      <path d="M46 82 L60 70 L74 82 L74 94 L66 94 L66 86 L54 86 L54 94 L46 94Z" fill="white" opacity="0.9" />
      <rect x="55" y="86" width="10" height="8" rx="1" fill="#0d1b2a" opacity="0.45" />
      <rect x="54" y="74" width="5" height="5" rx="0.5" fill="#0d1b2a" opacity="0.3" />
      <rect x="61" y="74" width="5" height="5" rx="0.5" fill="#0d1b2a" opacity="0.3" />

      {/* ── Big "L" letter center ── */}
      <text x="44" y="80" fontFamily="Arial Black, DM Sans, sans-serif" fontWeight="900" fontSize="42" fill="url(#lG)">L</text>

      <defs>
        <linearGradient id="pinG" x1="10" y1="4" x2="110" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="lG" x1="44" y1="40" x2="44" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Navbar logo — icon + "LOKESTA" text ──────────────
export function LOKESTALogo({ size = 42, showText = true }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.2) + "px" }}>
      <LOKESTAIcon size={size} />
      {showText && (
        <span style={{
          fontFamily: "'DM Sans', Arial, sans-serif",
          fontWeight: 900,
          fontSize: Math.round(size * 0.62) + "px",
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}>
          <span style={{ color: "#ffffff" }}>LOKE</span>
          <span style={{ color: "#f97316" }}>STA</span>
        </span>
      )}
    </div>
  );
}

// ── Big logo for Login/Register ───────────────────────
export function LOKESTALogoBig({ size = 100 }: { size?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <LOKESTAIcon size={size} />
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Sans', Arial, sans-serif",
          fontWeight: 900,
          fontSize: Math.round(size * 0.52) + "px",
          letterSpacing: "0.04em",
          lineHeight: 1,
        }}>
          <span style={{ color: "#ffffff" }}>LOKE</span>
          <span style={{ color: "#f97316" }}>STA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
          <span style={{ display: "block", width: "28px", height: "2px", background: "#f97316", borderRadius: "1px" }} />
          <p style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: Math.round(size * 0.12) + "px",
            letterSpacing: "0.1em",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
            fontStyle: "italic",
          }}>
            Find your place anywhere
          </p>
          <span style={{ display: "block", width: "28px", height: "2px", background: "#f97316", borderRadius: "1px" }} />
        </div>
      </div>
    </div>
  );
}

export default LOKESTALogo;
