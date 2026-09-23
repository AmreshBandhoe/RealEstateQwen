import React from 'react';
import { Listing } from '../types';
import { formatPrice } from '../utils/filters';
import { Currency } from '../types';

interface SurinameMapProps {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currency: Currency;
  savedIds: string[];
}

const DISTRICTS = [
  { name: 'Nickerie', x: 15, y: 28, w: 12, h: 10 },
  { name: 'Coronie', x: 22, y: 30, w: 10, h: 8 },
  { name: 'Saramacca', x: 28, y: 28, w: 14, h: 14 },
  { name: 'Paramaribo', x: 42, y: 30, w: 14, h: 12 },
  { name: 'Wanica', x: 34, y: 38, w: 12, h: 10 },
  { name: 'Commewijne', x: 52, y: 35, w: 14, h: 14 },
  { name: 'Marowijne', x: 65, y: 28, w: 18, h: 16 },
  { name: 'Para', x: 40, y: 48, w: 18, h: 18 },
  { name: 'Brokopondo', x: 48, y: 58, w: 16, h: 16 },
  { name: 'Sipaliwini', x: 30, y: 65, w: 45, h: 25 },
];

export const SurinameMap: React.FC<SurinameMapProps> = ({ listings, selectedId, onSelect, currency, savedIds }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-emerald-50 to-emerald-100 rounded-xl overflow-hidden border border-emerald-200">
      {/* Map Title */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
        <span className="text-xs font-semibold text-emerald-800">Suriname Property Map</span>
      </div>

      {/* SVG Map */}
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Ocean background */}
        <rect x="0" y="0" width="100" height="25" fill="#bfdbfe" opacity="0.4" />
        <text x="50" y="12" textAnchor="middle" className="text-[2px] fill-blue-400 font-light" fontSize="2.5">Atlantic Ocean</text>
        
        {/* District zones */}
        {DISTRICTS.map((d) => (
          <g key={d.name}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="0.3"
              opacity="0.6"
              rx="0.5"
            />
            <text
              x={d.x + d.w / 2}
              y={d.y + d.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-emerald-800 font-medium"
              fontSize={d.name === 'Sipaliwini' ? '2' : '1.8'}
            >
              {d.name}
            </text>
          </g>
        ))}

        {/* Rivers */}
        <path d="M 55 25 Q 58 35 60 45 Q 62 55 58 65" stroke="#60a5fa" strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M 30 25 Q 32 35 28 45" stroke="#60a5fa" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 70 25 Q 75 35 78 45" stroke="#60a5fa" strokeWidth="0.4" fill="none" opacity="0.5" />

        {/* Property pins */}
        {listings.map((listing) => {
          const isSelected = listing.id === selectedId;
          const isSaved = savedIds.includes(listing.id);
          const price = formatPrice(listing.price, listing.currency, currency);
          const isSale = listing.mode === 'sale';
          
          return (
            <g
              key={listing.id}
              onClick={() => onSelect(listing.id)}
              className="cursor-pointer"
              transform={`translate(${listing.mapPosition.x}, ${listing.mapPosition.y})`}
            >
              {/* Pin shadow */}
              <circle cx="0" cy="0.5" r={isSelected ? "2.5" : "1.8"} fill="rgba(0,0,0,0.15)" />
              {/* Pin */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? "2.2" : "1.5"}
                fill={isSale ? '#059669' : '#7c3aed'}
                stroke={isSelected ? '#fbbf24' : isSaved ? '#f59e0b' : 'white'}
                strokeWidth={isSelected ? "0.5" : "0.3"}
                className="transition-all duration-200"
              />
              {/* Icon */}
              <text
                x="0"
                y="0.5"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isSelected ? "1.5" : "1"}
                fill="white"
              >
                {isSale ? '⌂' : '⌂'}
              </text>
              {/* Price label on hover/selected */}
              {isSelected && (
                <g transform="translate(0, -4)">
                  <rect x="-8" y="-1.5" width="16" height="3" rx="0.5" fill="white" stroke="#e5e7eb" strokeWidth="0.2" />
                  <text x="0" y="0.3" textAnchor="middle" fontSize="1.2" className="fill-gray-800 font-semibold">
                    {price}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Compass */}
        <g transform="translate(90, 15)">
          <circle cx="0" cy="0" r="3" fill="white" stroke="#059669" strokeWidth="0.3" opacity="0.9" />
          <text x="0" y="-1" textAnchor="middle" fontSize="1.5" className="fill-emerald-800 font-bold">N</text>
          <path d="M 0 -2 L 0.5 0 L 0 2 L -0.5 0 Z" fill="#059669" opacity="0.5" />
        </g>

        {/* Scale bar */}
        <g transform="translate(5, 95)">
          <line x1="0" y1="0" x2="10" y2="0" stroke="#374151" strokeWidth="0.3" />
          <line x1="0" y1="-0.5" x2="0" y2="0.5" stroke="#374151" strokeWidth="0.3" />
          <line x1="10" y1="-0.5" x2="10" y2="0.5" stroke="#374151" strokeWidth="0.3" />
          <text x="5" y="-1" textAnchor="middle" fontSize="1.2" className="fill-gray-600">~50 km</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <span className="text-gray-600">For Sale</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-600"></div>
            <span className="text-gray-600">For Rent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-400"></div>
            <span className="text-gray-600">Saved</span>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
        <span className="text-xs text-gray-600">{listings.length} properties</span>
      </div>
    </div>
  );
};
