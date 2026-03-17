interface Props {
  location?: string;
}

export default function Map({ location }: Props) {
  return (
    <div style={styles.wrapper}>
      {/* Fake map grid */}
      <div style={styles.mapBg}>
        {/* Grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h${i}`} style={{ ...styles.hLine, top: `${i * 14}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v${i}`} style={{ ...styles.vLine, left: `${i * 14}%` }} />
        ))}

        {/* Decorative blobs */}
        <div style={{ ...styles.blob, background: "rgba(201,168,76,0.15)", width: 120, height: 80, top: "20%", left: "15%" }} />
        <div style={{ ...styles.blob, background: "rgba(184,92,56,0.12)", width: 90, height: 60, top: "50%", left: "55%" }} />
        <div style={{ ...styles.blob, background: "rgba(201,168,76,0.1)", width: 70, height: 50, top: "65%", left: "25%" }} />

        {/* Pin */}
        <div style={styles.pinWrap}>
          <div style={styles.pinPulse} />
          <div style={styles.pin}>
            <span style={{ fontSize: "1.4rem" }}>📍</span>
          </div>
          {location && (
            <div style={styles.pinLabel}>{location}</div>
          )}
        </div>

        {/* Overlay text */}
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <span style={{ fontSize: "1.5rem" }}>🗺️</span>
            <p style={styles.overlayTitle}>Map Coming Soon</p>
            <p style={styles.overlaySubtitle}>Google Maps integration in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  mapBg: {
    position: "relative",
    height: "260px",
    background: "#e8f0e8",
    overflow: "hidden",
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "1px",
    background: "rgba(0,0,0,0.06)",
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "1px",
    background: "rgba(0,0,0,0.06)",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(20px)",
  },
  pinWrap: {
    position: "absolute",
    top: "38%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    zIndex: 2,
  },
  pinPulse: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "rgba(201,168,76,0.25)",
    animation: "fadeIn 1.5s ease infinite alternate",
    top: "-8px",
    left: "-8px",
  },
  pin: {
    width: "36px",
    height: "36px",
    background: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  pinLabel: {
    background: "#0f1923",
    color: "#c9a84c",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
    marginTop: "4px",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(248,244,237,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  overlayCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "1.25rem 2rem",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  overlayTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    color: "#0f1923",
    fontWeight: 600,
  },
  overlaySubtitle: {
    color: "#9ca3af",
    fontSize: "0.8rem",
  },
};
