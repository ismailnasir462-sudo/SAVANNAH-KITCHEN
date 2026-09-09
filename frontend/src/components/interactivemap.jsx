import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon rendering issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center and animate map view when coordinates change
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
}

// Click listener on the map to jump marker pin on tap/click
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function InteractiveMap({ address, onAddressChange }) {
  // Default map position (Accra, Ghana)
  const [position, setPosition] = useState([5.6037, -0.1870]);
  const markerRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // 1. REVERSE GEOCODING (Map Pin Drag / Click -> Address Text)
  const reverseGeocode = async (lat, lng) => {
    try {
      isInternalUpdate.current = true;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        onAddressChange(data.display_name);
      }
    } catch (err) {
      console.error("Reverse Geocoding Error:", err);
    } finally {
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 500);
    }
  };

  // 2. FORWARD GEOCODING (Address Input -> Map Pin Move)
  useEffect(() => {
    if (isInternalUpdate.current || !address || address.trim().length < 4) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          const newLat = parseFloat(data[0].lat);
          const newLon = parseFloat(data[0].lon);
          setPosition([newLat, newLon]);
        }
      } catch (err) {
        console.error("Forward Geocoding Error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [address]);

  // Handle Marker Drag Event
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          const newPos = [latLng.lat, latLng.lng];
          setPosition(newPos);
          reverseGeocode(latLng.lat, latLng.lng);
        }
      },
    }),
    [onAddressChange]
  );

  // Handle Direct Map Click Event
  const handleMapClick = (newCoords) => {
    setPosition(newCoords);
    reverseGeocode(newCoords[0], newCoords[1]);
  };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-stone-500/20 relative z-0">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap position={position} />
        <MapClickHandler onLocationSelect={handleMapClick} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        />
      </MapContainer>
    </div>
  );
}