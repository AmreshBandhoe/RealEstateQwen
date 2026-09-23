import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Listing, Currency } from '../types';
import { formatPrice } from '../utils/filters';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface SurinameMapProps {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currency: Currency;
  savedIds: string[];
}

// Custom icon factory
function createIcon(isSale: boolean, isSelected: boolean, isSaved: boolean) {
  const color = isSale ? '#059669' : '#7c3aed';
  const borderColor = isSelected ? '#fbbf24' : isSaved ? '#f59e0b' : '#ffffff';
  const size = isSelected ? 42 : 34;
  const borderWidth = isSelected ? 4 : 3;

  const svg = `
    <svg width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - borderWidth}" 
                fill="${color}" 
                stroke="${borderColor}" 
                stroke-width="${borderWidth}"/>
        <text x="${size/2}" y="${size/2 + 1}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-size="${size * 0.45}" 
              fill="white"
              font-family="Arial, sans-serif">⌂</text>
        <path d="M ${size/2 - 6} ${size - 2} L ${size/2} ${size + 8} L ${size/2 + 6} ${size - 2}" 
              fill="${color}"/>
      </g>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 5)],
  });
}

// Component to fly to selected marker
function FlyToMarker({ coordinates }: { coordinates: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 13, { duration: 0.8 });
    }
  }, [coordinates, map]);
  return null;
}

export const SurinameMap: React.FC<SurinameMapProps> = ({ listings, selectedId, onSelect, currency, savedIds }) => {
  const selectedListing = listings.find(l => l.id === selectedId);
  const flyToCoords: [number, number] | null = selectedListing 
    ? [selectedListing.coordinates.lat, selectedListing.coordinates.lng] 
    : null;

  // Default center: Paramaribo
  const defaultCenter: [number, number] = [5.8520, -55.2038];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        minZoom={7}
        maxZoom={17}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToMarker coordinates={flyToCoords} />

        {listings.map((listing) => {
          const isSelected = listing.id === selectedId;
          const isSaved = savedIds.includes(listing.id);
          const isSale = listing.mode === 'sale';
          const position: [number, number] = [listing.coordinates.lat, listing.coordinates.lng];
          const price = formatPrice(listing.price, listing.currency, currency);

          return (
            <Marker
              key={listing.id}
              position={position}
              icon={createIcon(isSale, isSelected, isSaved)}
              eventHandlers={{
                click: () => onSelect(listing.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-sm text-stone-900 mb-1">{listing.title}</h3>
                  <p className="text-emerald-700 font-bold text-base">{price}</p>
                  {listing.mode === 'rent' && <span className="text-xs text-stone-500">/maand</span>}
                  <p className="text-xs text-stone-500 mt-1">
                    {listing.neighborhood}, {listing.district}
                  </p>
                  <div className="flex gap-2 mt-2 text-xs text-stone-600">
                    {listing.bedrooms > 0 && <span>🛏 {listing.bedrooms}</span>}
                    {listing.bathrooms > 0 && <span>🚿 {listing.bathrooms}</span>}
                    {listing.livingArea > 0 && <span>📐 {listing.livingArea}m²</span>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-5 left-5 z-[1000] bg-white/95 backdrop-blur-sm px-5 py-3.5 rounded-xl shadow-lg border border-stone-100">
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <span className="text-stone-600 font-medium">Koop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <span className="text-stone-600 font-medium">Huur</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-amber-400"></div>
            <span className="text-stone-600 font-medium">Opgeslagen</span>
          </div>
        </div>
      </div>

      {/* Count overlay */}
      <div className="absolute top-5 right-5 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg border border-stone-100">
        <span className="text-sm font-semibold text-stone-600">{listings.length} woningen</span>
      </div>
    </div>
  );
};
