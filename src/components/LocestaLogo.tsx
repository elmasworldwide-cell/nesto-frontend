// LokestaLogo.tsx — Shared logo component matching the exact brand image
// Usage: <LokestaLogo size={44} /> or <LokestaLogo size={80} />

interface LogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
}

export function LokestaIcon({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Outer arc / top of pin ── */}
      <path
        d="M60 8 C38 8 20 26 20 48 C20 52 21 56 23 60"
        stroke="url(#arcGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M97 60 C99 56 100 52 100 48 C100 26 82 8 60 8"
        stroke="url(#arcGrad2)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Pin body (V-shape bottom) ── */}
      <path
        d="M23 60 C30 75 45 90 60 112 C75 90 90 75 97 60 L60 60 Z"
        fill="url(#pinBody)"
      />

      {/* ── Pin inner circle ── */}
      <circle cx="60" cy="62" r="10" fill="url(#circleGrad)" />
      <circle cx="60" cy="62" r="5" fill="#0f1923" opacity="0.5" />

      {/* ── White house roof ── */}
      <path
        d="M26 52 L60 24 L94 52"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Chimney */}
      <rect x="74" y="28" width="6" height="12" rx="1" fill="white" opacity="0.9" />

      {/* ── Window 2×2 grid ── */}
      <rect x="47" y="36" width="8" height="7" rx="1.5" fill="white" opacity="0.95" />
      <rect x="58" y="36" width="8" height="7" rx="1.5" fill="white" opacity="0.95" />
      <rect x="47" y="46" width="8" height="7" rx="1.5" fill="white" opacity="0.95" />
      <rect x="58" y="46" width="8" height="7" rx="1.5" fill="white" opacity="0.95" />

      <defs>
        <linearGradient id="arcGrad" x1="20" y1="8" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="arcGrad2" x1="100" y1="8" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="pinBody" x1="23" y1="60" x2="97" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="circleGrad" x1="50" y1="52" x2="70" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LokestaLogo({ size = 44, showText = true, showTagline = false }: LogoProps) {
  const iconSize = size;
  const textSize = size * 0.75;
  const taglineSize = size * 0.28;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.18 + "px" }}>
      <LokestaIcon size={iconSize} />
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: textSize + "px",
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}>
            <span style={{ color: "#ffffff" }}>Loce</span>
            <span style={{ color: "#f97316" }}>sta</span>
          </span>
          {showTagline && (
            <span style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: taglineSize + "px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Find your place anywhere
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Large logo for Login/Register pages — with tagline below icon
export function LokestaLogoBig({ size = 80 }: { size?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
      <LokestaIcon size={size} />
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: size * 0.62 + "px",
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}>
          <span style={{ color: "#ffffff" }}>Loce</span>
          <span style={{ color: "#f97316" }}>sta</span>
        </div>
        <p style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: size * 0.14 + "px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: "4px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          — Find your place anywhere —
        </p>
      </div>
    </div>
  );
}

export default LokestaLogo;
