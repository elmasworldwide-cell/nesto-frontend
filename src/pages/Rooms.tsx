import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import RoomCard from "../components/RoomCard";
import { getRooms, formatPrice } from "../services/roomsService";

const CITIES = ["All", "Arusha", "Dar es Salaam", "Moshi", "Zanzibar", "Dodoma", "Mwanza"];

// Static fallback rooms when backend is offline
const fallbackRooms = [
  { id: 1, title: "Single Room - Njiro", price: 80000, location: "Njiro, Arusha", city: "Arusha", description: "Nice single room near Njiro center.", phone: "0754123456", images: [{ id: 1, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
  { id: 2, title: "Modern Apartment - Dar", price: 300000, location: "Kinondoni, Dar es Salaam", city: "Dar es Salaam", description: "Modern apartment in the city center.", phone: "0712345678", images: [{ id: 2, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
  { id: 3, title: "Studio Room - Moshi", price: 120000, location: "Shantytown, Moshi", city: "Moshi", description: "Comfortable studio room near town center.", phone: "0765432198", images: [{ id: 3, url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
  { id: 4, title: "Self-Contained - Zanzibar", price: 150000, location: "Stone Town, Zanzibar", city: "Zanzibar", description: "Beautiful room steps from the beach.", phone: "0789456123", images: [{ id: 4, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
  { id: 5, title: "Bedsitter - Dodoma", price: 60000, location: "Makole, Dodoma", city: "Dodoma", description: "Affordable bedsitter in quiet Makole area.", phone: "0723654987", images: [{ id: 5, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
  { id: 6, title: "2-Bedroom - Arusha", price: 250000, location: "Kijenge, Arusha", city: "Arusha", description: "Spacious 2-bedroom in upmarket Kijenge.", phone: "0756789012", images: [{ id: 6, url: "https://images.unsplash.com/photo-1484154218962-a197022b5858" }], owner: { id: 1, name: "Owner", email: "" }, ownerId: 1, createdAt: "" },
];

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState("default");

  // Fetch rooms from backend
  const { data: backendRooms, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
    retry: 1,
  });

  // Use backend rooms or fallback
  const allRooms = useMemo(() => {
    if (backendRooms && backendRooms.length > 0) return backendRooms;
    return fallbackRooms;
  }, [backendRooms]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = allRooms.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase());
      const matchCity = selectedCity === "All" || r.city === selectedCity;
      return matchSearch && matchCity;
    });

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [search, selectedCity, sortBy, allRooms]);

  // Convert backend room to RoomCard format
  const toCardFormat = (room: typeof allRooms[0]) => ({
    id: room.id,
    title: room.title,
    price: formatPrice(room.price),
    location: room.location,
    city: room.city,
    description: room.description,
    image: room.images?.[0]?.url || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Find Your Room</h1>
          <div style={styles.headerMeta}>
            <p style={styles.subtitle}>
              {isLoading ? "Loading rooms..." : `${filtered.length} rooms available`}
            </p>
            {isError && (
              <span style={styles.offlineBadge}>
                📴 Offline mode — showing sample rooms
              </span>
            )}
            {!isError && !isLoading && backendRooms && (
              <span style={styles.onlineBadge}>
                🟢 Live from database
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Search & Filter */}
        <div style={styles.filterBar}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch("")} style={styles.clearBtn}>✕</button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* City Pills */}
        <div style={styles.cityPills}>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                ...styles.pill,
                ...(selectedCity === city ? styles.pillActive : {}),
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div style={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        )}

        {/* Rooms grid */}
        {!isLoading && filtered.length === 0 && (
          <div style={styles.empty}>
            <span style={{ fontSize: "3rem" }}>🏚️</span>
            <h3 style={styles.emptyTitle}>No rooms found</h3>
            <p style={styles.emptyText}>Try a different search or city filter</p>
            <button
              onClick={() => { setSearch(""); setSelectedCity("All"); }}
              style={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div style={styles.grid}>
            {filtered.map((room, i) => (
              <RoomCard key={room.id} room={toCardFormat(room)} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f8f4ed" },
  header: { background: "#0f1923", padding: "3rem 1.5rem" },
  headerContent: { maxWidth: "1200px", margin: "0 auto" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#fff", marginBottom: "0.5rem" },
  headerMeta: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" },
  subtitle: { color: "#c9a84c", fontSize: "1rem" },
  onlineBadge: { background: "rgba(5,150,105,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 },
  offlineBadge: { background: "rgba(234,179,8,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600 },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" },
  filterBar: { display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" },
  searchWrap: { flex: 1, minWidth: "260px", position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: "14px", fontSize: "0.95rem", zIndex: 1 },
  searchInput: { width: "100%", padding: "0.875rem 2.5rem 0.875rem 2.75rem", borderRadius: "12px", border: "1.5px solid #e5e0d8", background: "#fff", fontSize: "0.9rem", color: "#0f1923", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", outline: "none", fontFamily: "'DM Sans', sans-serif" },
  clearBtn: { position: "absolute", right: "12px", background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "0.85rem", padding: "4px" },
  select: { padding: "0.875rem 1.25rem", borderRadius: "12px", border: "1.5px solid #e5e0d8", background: "#fff", fontSize: "0.875rem", color: "#0f1923", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontFamily: "'DM Sans', sans-serif" },
  cityPills: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" },
  pill: { padding: "0.5rem 1.25rem", borderRadius: "20px", border: "1.5px solid #e5e0d8", background: "#fff", fontSize: "0.85rem", fontWeight: 500, color: "#6b7280", cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" },
  pillActive: { background: "#0f1923", color: "#c9a84c", border: "1.5px solid #0f1923" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.75rem" },
  skeleton: { height: "320px", borderRadius: "16px", background: "linear-gradient(90deg, #e8e0d4 25%, #f0e8dc 50%, #e8e0d4 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" },
  empty: { textAlign: "center", padding: "5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#0f1923" },
  emptyText: { color: "#9ca3af", fontSize: "0.9rem" },
  resetBtn: { marginTop: "0.5rem", padding: "0.75rem 1.75rem", background: "#0f1923", color: "#c9a84c", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif" },
};
