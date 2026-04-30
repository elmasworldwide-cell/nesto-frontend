import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCPYXpoBYV7EC9eD2hikhsuO6stbL8D34w";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Arusha": { lat: -3.3869, lng: 36.6830 },
  "Dar es Salaam": { lat: -6.7924, lng: 39.2083 },
  "Moshi": { lat: -3.3549, lng: 37.3407 },
  "Zanzibar": { lat: -6.1659, lng: 39.2026 },
  "Dodoma": { lat: -6.1722, lng: 35.7395 },
  "Mwanza": { lat: -2.5164, lng: 32.9175 },
  "Tanga": { lat: -5.0893, lng: 39.0993 },
};

interface Props {
  location?: string;
  city?: string;
  title?: string;
  price?: string;
  height?: number;
}

export default function GoogleMapComponent({ location, city, title, price, height = 280 }: Props) {
  const [showInfo, setShowInfo] = useState(false);
  const coords = (city && CITY_COORDS[city]) ? CITY_COORDS[city] : { lat: -6.3690, lng: 34.8888 };

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: "100%", height: `${height}px` }}
          defaultCenter={coords}
          defaultZoom={14}
          gestureHandling="cooperative"
          mapId="lokesta-map"
        >
          <Marker position={coords} onClick={() => setShowInfo(true)} title={title || location} />
          {showInfo && (
            <InfoWindow position={coords} onCloseClick={() => setShowInfo(false)}>
              <div style={{ padding: "8px", maxWidth: "180px", fontFamily: "'DM Sans', sans-serif" }}>
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f1923", marginBottom: "4px" }}>{title || "Property"}</p>
                <p style={{ color: "#6b7280", fontSize: "0.75rem", marginBottom: "4px" }}>📍 {location || city}</p>
                {price && <p style={{ color: "#f97316", fontWeight: 700, fontSize: "0.82rem" }}>{price}/mwezi</p>}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
