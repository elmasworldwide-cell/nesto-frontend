import React from 'react';

interface Marker {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  center?: Marker;
  markers?: Marker[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ center, markers = [] }) => {
  // simple placeholder map without external API
  return (
    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
      <div className="text-center text-sm text-gray-700">
        {center && (
          <p>
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
        )}
        {markers.length > 0 && (
          <>
            <p className="mt-2">Markers:</p>
            <ul className="list-disc list-inside">
              {markers.map((m, i) => (
                <li key={i}>
                  {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                </li>
              ))}
            </ul>
          </>
        )}
        {markers.length === 0 && !center && <p>No location data</p>}
      </div>
    </div>
  );
};

export default GoogleMap;
