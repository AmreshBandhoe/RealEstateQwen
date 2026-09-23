import React, { useState, useMemo, useCallback } from 'react';
import { Listing, Filters, Currency, ListingStatus } from './types';
import { listings as allListings } from './data/listings';
import { applyFilters, sortListings, getDefaultFilters, formatPrice } from './utils/filters';
import { getSavedIds, toggleSaved, addRecent, getRecentIds } from './utils/storage';
import { SurinameMap } from './components/SurinameMap';
import { ListingDetail } from './components/ListingDetail';
import { Calculator } from './components/Calculator';
import { FilterPanel } from './components/FilterPanel';
import {
  Search, SlidersHorizontal, Heart, MapPin, Home, Calculator as CalcIcon,
  ChevronDown, X, Grid3X3, List,
  Bed, Bath, Maximize, LandPlot, Star, TrendingDown, Clock, Tag
} from 'lucide-react';

type View = 'listings' | 'detail' | 'saved' | 'calculator';
type LayoutMode = 'split' | 'list' | 'map';

export default function App() {
  const [view, setView] = useState<View>('listings');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(getDefaultFilters());
  const [sortBy, setSortBy] = useState('newest');
  const [savedIds, setSavedIds] = useState<string[]>(getSavedIds());
  const [showFilters, setShowFilters] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>(getRecentIds());

  const filteredListings = useMemo(() => {
    let result = applyFilters(allListings, filters);
    if (view === 'saved') {
      result = result.filter(l => savedIds.includes(l.id));
    }
    return sortListings(result, sortBy, filters.currency);
  }, [filters, sortBy, view, savedIds]);

  const selectedListing = useMemo(() => {
    return allListings.find(l => l.id === selectedListingId) || null;
  }, [selectedListingId]);

  const handleToggleSave = useCallback((id: string) => {
    const nowSaved = toggleSaved(id);
    setSavedIds(getSavedIds());
  }, []);

  const handleSelectListing = useCallback((id: string) => {
    setSelectedListingId(id);
    setView('detail');
    addRecent(id);
    setRecentIds(getRecentIds());
  }, []);

  const handleBackToListings = useCallback(() => {
    setView('listings');
    setSelectedListingId(null);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.mode !== 'all') count++;
    if (filters.district !== 'all') count++;
    if (filters.neighborhood !== 'all') count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.priceMin > 0) count++;
    if (filters.priceMax > 0) count++;
    if (filters.bedroomsMin > 0) count++;
    if (filters.bathroomsMin > 0) count++;
    if (filters.furnished !== null) count++;
    if (filters.parking) count++;
    if (filters.airConditioning) count++;
    if (filters.gatedYard) count++;
    if (filters.securityBars) count++;
    if (filters.generatorReady) count++;
    if (filters.waterTank) count++;
    if (filters.hotWater) count++;
    if (filters.internetReady) count++;
    if (filters.nearSchools) count++;
    if (filters.nearSupermarkets) count++;
    if (filters.nearBusRoute) count++;
    if (filters.petFriendly) count++;
    if (filters.suitableForExpats) count++;
    if (filters.suitableForStudents) count++;
    if (filters.commercialZoning) count++;
    if (filters.clearTitle) count++;
    if (filters.status !== 'all') count++;
    return count;
  }, [filters]);

  // Detail view
  if (view === 'detail' && selectedListing) {
    return (
      <ListingDetail
        listing={selectedListing}
        onBack={handleBackToListings}
        onSave={handleToggleSave}
        isSaved={savedIds.includes(selectedListing.id)}
        currency={filters.currency}
        onCurrencyChange={(c: Currency) => setFilters(f => ({ ...f, currency: c }))}
        similarListings={filteredListings.filter(l => l.id !== selectedListing.id).slice(0, 3)}
        onSelectSimilar={handleSelectListing}
      />
    );
  }

  // Calculator view
  if (view === 'calculator') {
    return (
      <Calculator
        onBack={handleBackToListings}
        currency={filters.currency}
        listings={allListings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">SurinameProperty</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">Zoek uw droomwoning</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op locatie, adres, of listing ID..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Currency toggle */}
              <button
                onClick={() => setFilters(f => ({ ...f, currency: f.currency === 'SRD' ? 'USD' : 'SRD' }))}
                className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {filters.currency}
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Calculator */}
              <button
                onClick={() => setView('calculator')}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Calculator"
              >
                <CalcIcon className="w-5 h-5" />
              </button>

              {/* Saved */}
              <button
                onClick={() => setView(view === 'saved' ? 'listings' : 'saved')}
                className={`relative p-2 rounded-lg transition-colors ${view === 'saved' ? 'text-rose-600 bg-rose-50' : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'}`}
                title="Saved properties"
              >
                <Heart className="w-5 h-5" fill={view === 'saved' ? 'currentColor' : 'none'} />
                {savedIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {savedIds.length}
                  </span>
                )}
              </button>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${showFilters ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Toggle Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Buy/Rent toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['all', 'sale', 'rent'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilters(f => ({ ...f, mode }))}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filters.mode === mode ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {mode === 'all' ? 'All' : mode === 'sale' ? 'Koop' : 'Huur'}
                </button>
              ))}
            </div>

            {/* Currency mobile */}
            <button
              onClick={() => setFilters(f => ({ ...f, currency: f.currency === 'SRD' ? 'USD' : 'SRD' }))}
              className="sm:hidden px-2 py-1.5 text-xs font-medium bg-gray-100 rounded-lg"
            >
              {filters.currency}
            </button>
          </div>

          {/* Layout controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{filteredListings.length} resultaten</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="newest">Nieuwste</option>
              <option value="price-asc">Prijs ↑</option>
              <option value="price-desc">Prijs ↓</option>
              <option value="largest">Grootste</option>
              <option value="bedrooms">Slaapkamers</option>
            </select>

            {/* Layout mode - desktop only */}
            <div className="hidden lg:flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setLayoutMode('split')} className={`p-1.5 rounded-md ${layoutMode === 'split' ? 'bg-white shadow-sm' : ''}`}>
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setLayoutMode('list')} className={`p-1.5 rounded-md ${layoutMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
                <List className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setLayoutMode('map')} className={`p-1.5 rounded-md ${layoutMode === 'map' ? 'bg-white shadow-sm' : ''}`}>
                <MapPin className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
          onReset={() => setFilters(getDefaultFilters())}
        />
      )}

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        {/* Mobile: Tab switcher */}
        <div className="lg:hidden flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setLayoutMode('list')}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors ${layoutMode !== 'map' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500'}`}
          >
            <List className="w-4 h-4 inline mr-1" />
            Lijst
          </button>
          <button
            onClick={() => setLayoutMode('map')}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors ${layoutMode === 'map' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500'}`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Kaart
          </button>
        </div>

        {/* Desktop split layout */}
        <div className={`flex ${layoutMode === 'map' ? 'hidden lg:flex' : ''}`}>
          {/* Listings panel */}
          <div className={`${layoutMode === 'split' ? 'lg:w-1/2 xl:w-[55%]' : layoutMode === 'list' ? 'w-full' : 'hidden lg:block lg:w-1/2 xl:w-[55%]'} overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 160px)' }}>
            {view === 'saved' && (
              <div className="px-4 py-3 bg-rose-50 border-b border-rose-100">
                <h2 className="text-sm font-semibold text-rose-800">
                  <Heart className="w-4 h-4 inline mr-1" fill="currentColor" />
                  Opgeslagen woningen ({savedIds.length})
                </h2>
              </div>
            )}

            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Geen resultaten</h3>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Probeer andere filters of zoektermen
                </p>
                <button
                  onClick={() => setFilters(getDefaultFilters())}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-3 p-3 ${layoutMode === 'map' ? 'lg:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    currency={filters.currency}
                    isSaved={savedIds.includes(listing.id)}
                    isSelected={selectedListingId === listing.id || hoveredPinId === listing.id}
                    onSelect={() => handleSelectListing(listing.id)}
                    onToggleSave={() => handleToggleSave(listing.id)}
                    onHover={setHoveredPinId}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Map panel */}
          <div className={`${layoutMode === 'split' ? 'lg:w-1/2 xl:w-[45%]' : layoutMode === 'map' ? 'w-full' : 'hidden lg:block lg:w-1/2 xl:w-[45%]'} sticky top-[120px]`} style={{ height: 'calc(100vh - 160px)' }}>
            <div className="p-3 h-full">
              <SurinameMap
                listings={filteredListings}
                selectedId={hoveredPinId || selectedListingId}
                onSelect={(id) => {
                  setHoveredPinId(id);
                  setTimeout(() => setHoveredPinId(null), 2000);
                }}
                currency={filters.currency}
                savedIds={savedIds}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Listing Card Component
interface ListingCardProps {
  listing: Listing;
  currency: Currency;
  isSaved: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onHover: (id: string | null) => void;
}

function ListingCard({ listing, currency, isSaved, isSelected, onSelect, onToggleSave, onHover }: ListingCardProps) {
  const statusColors: Record<ListingStatus, string> = {
    'New Listing': 'bg-emerald-500',
    'Price Reduced': 'bg-amber-500',
    'Available Immediately': 'bg-blue-500',
    'Under Option': 'bg-orange-500',
    'Sold': 'bg-red-500',
    'Rented': 'bg-purple-500',
    'Open House': 'bg-pink-500',
  };

  const statusIcons: Record<ListingStatus, React.ReactNode> = {
    'New Listing': <Star className="w-3 h-3" />,
    'Price Reduced': <TrendingDown className="w-3 h-3" />,
    'Available Immediately': <Clock className="w-3 h-3" />,
    'Under Option': <Tag className="w-3 h-3" />,
    'Sold': <X className="w-3 h-3" />,
    'Rented': <X className="w-3 h-3" />,
    'Open House': <Home className="w-3 h-3" />,
  };

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${isSelected ? 'border-emerald-400 shadow-md ring-1 ring-emerald-200' : 'border-gray-200 hover:border-emerald-200'}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Status badge */}
        <div className={`absolute top-2 left-2 ${statusColors[listing.status]} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1`}>
          {statusIcons[listing.status]}
          {listing.status}
        </div>
        {/* Mode badge */}
        <div className={`absolute top-2 right-10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ${listing.mode === 'sale' ? 'bg-emerald-600' : 'bg-violet-600'}`}>
          {listing.mode === 'sale' ? 'Koop' : 'Huur'}
        </div>
        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-rose-500 hover:text-white'}`}
        >
          <Heart className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {/* Tags */}
        {listing.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {listing.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-white/90 backdrop-blur-sm text-[9px] font-medium text-gray-700 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{listing.neighborhood}, {listing.district}</span>
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-bold text-emerald-700">
            {formatPrice(listing.price, listing.currency, currency)}
          </span>
          {listing.mode === 'rent' && <span className="text-xs text-gray-500">/maand</span>}
          {listing.currency !== currency && (
            <span className="text-[10px] text-gray-400 ml-1">
              ({formatPrice(listing.price, listing.currency)})
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-0.5">
              <Bed className="w-3 h-3" />
              {listing.bedrooms}
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-0.5">
              <Bath className="w-3 h-3" />
              {listing.bathrooms}
            </span>
          )}
          {listing.livingArea > 0 && (
            <span className="flex items-center gap-0.5">
              <Maximize className="w-3 h-3" />
              {listing.livingArea}m²
            </span>
          )}
          {listing.landSize > 0 && (
            <span className="flex items-center gap-0.5">
              <LandPlot className="w-3 h-3" />
              {listing.landSize}m²
            </span>
          )}
        </div>

        {/* Property type */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
            {listing.propertyType}
          </span>
          {listing.furnished && (
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
              Gemeubileerd
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
