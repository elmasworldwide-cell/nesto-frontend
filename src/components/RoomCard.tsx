import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Room {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  description?: string;
}

interface Props {
  room: Room;
  index?: number;
}

export default function RoomCard({ room, index = 0 }: Props) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        animationDelay: `${index * 0.1}s`,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.18)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
      onClick={() => navigate(`/property/${room.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={styles.imageWrap}>
        {!imgLoaded && <div style={styles.imgSkeleton} />}
        <img
          src={`${room.image}?w=600&q=80`}
          alt={room.title}
          style={{
            ...styles.image,
            opacity: imgLoaded ? 1 : 0,
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Price Badge */}
        <div style={styles.priceBadge}>
          <span style={styles.priceText}>{room.price}</span>
          <span style={styles.priceMonth}>/mo</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{room.title}</h3>
        <div style={styles.location}>
          <span style={styles.locationIcon}>📍</span>
          <span style={styles.locationText}>{room.location}</span>
        </div>

        {room.description && (
          <p style={styles.description}>
            {room.description.length > 70
              ? room.description.slice(0, 70) + "..."
              : room.description}
          </p>
        )}

        <div style={styles.footer}>
          <button
            style={{
              ...styles.viewBtn,
              background: hovered ? "#0f1923" : "transparent",
              color: hovered ? "#c9a84c" : "#0f1923",
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    animation: "fadeUp 0.6s ease forwards",
    opacity: 0,
    border: "1px solid rgba(0,0,0,0.06)",
  },
  imageWrap: {
    position: "relative",
    overflow: "hidden",
    height: "210px",
    background: "#e8e0d4",
  },
  imgSkeleton: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, #e8e0d4 25%, #f0e8dc 50%, #e8e0d4 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease, opacity 0.3s ease",
  },
  priceBadge: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    background: "rgba(15,25,35,0.88)",
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    padding: "6px 12px",
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
  },
  priceText: {
    color: "#c9a84c",
    fontWeight: 700,
    fontSize: "0.95rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  priceMonth: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.75rem",
  },
  content: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#0f1923",
    lineHeight: 1.3,
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  locationIcon: {
    fontSize: "0.8rem",
  },
  locationText: {
    color: "#6b7280",
    fontSize: "0.85rem",
  },
  description: {
    color: "#9ca3af",
    fontSize: "0.82rem",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "0.5rem",
    paddingTop: "0.75rem",
    borderTop: "1px solid #f3f4f6",
  },
  viewBtn: {
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    padding: "7px 16px",
    borderRadius: "7px",
    border: "1.5px solid #0f1923",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
};
