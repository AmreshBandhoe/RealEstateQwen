import React from 'react';
import { Filters, District, Neighborhood, PropertyType, ListingStatus } from '../types';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose: () => void;
  onReset: () => void;
}

const DISTRICTS: District[] = ['Paramaribo', 'Wanica', 'Commewijne', 'Nickerie', 'Saramacca', 'Para', 'Marowijne', 'Coronie', 'Brokopondo', 'Sipaliwini'];

const NEIGHBORHOODS: Neighborhood[] = ['Zorg en Hoop', 'Rainville', 'Uitvlugt', 'Latour', 'Flora', 'Maretraite', 'Blauwgrond', 'Kwatta', 'Beekhuizen', 'Tourtonne', 'Meerzorg', 'Lelydorp', 'Domburg', 'Groningen', 'Nieuw Nickerie', 'Albina'];

const PROPERTY_TYPES: PropertyType[] = ['House', 'Apartment', 'Villa', 'Townhouse', 'Commercial', 'Building Lot', 'Agricultural Land', 'Vacation Home', 'Student Room'];

const STATUSES: ListingStatus[] = ['New Listing', 'Price Reduced', 'Available Immediately', 'Under Option', 'Sold', 'Rented', 'Open House'];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onClose, onReset }) => {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const activeCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'mode' && value !== 'all') return true;
    if (key === 'district' && value !== 'all') return true;
    if (key === 'neighborhood' && value !== 'all') return true;
    if (key === 'propertyType' && value !== 'all') return true;
    if (key === 'status' && value !== 'all') return true;
    if (typeof value === 'number' && value > 0) return true;
    if (typeof value === 'boolean' && value === true) return true;
    if (key === 'furnished' && value !== null) return true;
    return false;
  }).length;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Filters {activeCount > 0 && `(${activeCount} actief)`}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onReset} className="text-xs text-gray-500 hover:text-gray-700 underline">
              Reset alles
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* District */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">District</label>
            <select
              value={filters.district}
              onChange={(e) => update({ district: e.target.value as District | 'all', neighborhood: 'all' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Alle districten</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Neighborhood */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Buurt</label>
            <select
              value={filters.neighborhood}
              onChange={(e) => update({ neighborhood: e.target.value as Neighborhood | 'all' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Alle buurten</option>
              {NEIGHBORHOODS.filter(n => filters.district === 'all' || true).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Type woning</label>
            <select
              value={filters.propertyType}
              onChange={(e) => update({ propertyType: e.target.value as PropertyType | 'all' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Alle types</option>
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => update({ status: e.target.value as ListingStatus | 'all' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Alle statussen</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Prijs ({filters.currency})
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ''}
                onChange={(e) => update({ priceMin: Number(e.target.value) || 0 })}
                className="w-1/2 text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ''}
                onChange={(e) => update({ priceMax: Number(e.target.value) || 0 })}
                className="w-1/2 text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Slaapkamers (min)</label>
            <select
              value={filters.bedroomsMin}
              onChange={(e) => update({ bedroomsMin: Number(e.target.value) })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={0}>Alle</option>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Badkamers (min)</label>
            <select
              value={filters.bathroomsMin}
              onChange={(e) => update({ bathroomsMin: Number(e.target.value) })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value={0}>Alle</option>
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>

          {/* Living Area */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Woonopp. min (m²)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.livingAreaMin || ''}
              onChange={(e) => update({ livingAreaMin: Number(e.target.value) || 0 })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Land Size */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Perceel min (m²)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.landSizeMin || ''}
              onChange={(e) => update({ landSizeMin: Number(e.target.value) || 0 })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Furnished */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Gemeubileerd</label>
            <select
              value={filters.furnished === null ? 'any' : filters.furnished ? 'yes' : 'no'}
              onChange={(e) => update({ furnished: e.target.value === 'any' ? null : e.target.value === 'yes' })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="any">Maakt niet uit</option>
              <option value="yes">Gemeubileerd</option>
              <option value="no">Niet gemeubileerd</option>
            </select>
          </div>
        </div>

        {/* Amenity Toggles */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-2">Voorzieningen & Kenmerken</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'parking', label: 'Parking' },
              { key: 'airConditioning', label: 'Airco' },
              { key: 'gatedYard', label: 'Omheind erf' },
              { key: 'securityBars', label: 'Traliewerk' },
              { key: 'generatorReady', label: 'Generator' },
              { key: 'waterTank', label: 'Watertank' },
              { key: 'hotWater', label: 'Warm water' },
              { key: 'internetReady', label: 'Internet' },
              { key: 'nearSchools', label: 'Nabij scholen' },
              { key: 'nearSupermarkets', label: 'Nabij supermarkt' },
              { key: 'nearBusRoute', label: 'Nabij busroute' },
              { key: 'petFriendly', label: 'Huisdieren OK' },
              { key: 'suitableForExpats', label: 'Geschikt expats' },
              { key: 'suitableForStudents', label: 'Geschikt studenten' },
              { key: 'commercialZoning', label: 'Commercieel' },
              { key: 'clearTitle', label: 'Grondpapieren in orde' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => update({ [key]: !filters[key as keyof Filters] } as any)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filters[key as keyof Filters]
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
