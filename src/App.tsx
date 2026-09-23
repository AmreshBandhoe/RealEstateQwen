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
    toggleSaved(id);
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
    <div className="min-h-screen bg-stone-50">
      {/* ============ HEADER ============ */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-stone-900 leading-tight tracking-tight">SurinameProperty</h1>
                <p className="text-xs text-stone-500 mt-0.5">Zoek uw droomwoning</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Zoek op locatie, adres, buurt of listing ID..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                  className="w-full pl-12 pr-5 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Nav */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Currency toggle */}
              <button
                onClick={() => setFilters(f => ({ ...f, currency: f.currency === 'SRD' ? 'USD' : 'SRD' }))}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors text-stone-700"
              >
                {filters.currency}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Calculator */}
              <button
                onClick={() => setView('calculator')}
                className="p-3 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Calculator"
              >
                <CalcIcon className="w-5 h-5" />
              </button>

              {/* Saved */}
              <button
                onClick={() => setView(view === 'saved' ? 'listings' : 'saved')}
                className={`relative p-3 rounded-xl transition-colors ${view === 'saved' ? 'text-rose-600 bg-rose-50' : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'}`}
                title="Saved properties"
              >
                <Heart className="w-5 h-5" fill={view === 'saved' ? 'currentColor' : 'none'} />
                {savedIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedIds.length}
                  </span>
                )}
              </button>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all ${showFilters ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
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

      {/* ============ MODE BAR ============ */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Buy/Rent toggle */}
            <div className="flex bg-stone-100 rounded-xl p-1">
              {(['all', 'sale', 'rent'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilters(f => ({ ...f, mode }))}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${filters.mode === mode ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-600 hover:text-stone-800'}`}
                >
                  {mode === 'all' ? 'Alle' : mode === 'sale' ? 'Koop' : 'Huur'}
                </button>
              ))}
            </div>

            {/* Currency mobile */}
            <button
              onClick={() => setFilters(f => ({ ...f, currency: f.currency === 'SRD' ? 'USD' : 'SRD' }))}
              className="sm:hidden px-3 py-2 text-sm font-semibold bg-stone-100 rounded-xl"
            >
              {filters.currency}
            </button>
          </div>

          {/* Layout controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500 font-medium">{filteredListings.length} resultaten</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium text-stone-700"
            >
              <option value="newest">Nieuwste</option>
              <option value="price-asc">Prijs ↑</option>
              <option value="price-desc">Prijs ↓</option>
              <option value="largest">Grootste</option>
              <option value="bedrooms">Slaapkamers</option>
            </select>

            {/* Layout mode - desktop only */}
            <div className="hidden lg:flex bg-stone-100 rounded-xl p-1">
              <button onClick={() => setLayoutMode('split')} className={`p-2.5 rounded-lg transition-all ${layoutMode === 'split' ? 'bg-white shadow-sm' : ''}`} title="Split view">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setLayoutMode('list')} className={`p-2.5 rounded-lg transition-all ${layoutMode === 'list' ? 'bg-white shadow-sm' : ''}`} title="List view">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setLayoutMode('map')} className={`p-2.5 rounded-lg transition-all ${layoutMode === 'map' ? 'bg-white shadow-sm' : ''}`} title="Map view">
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FILTER PANEL ============ */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
          onReset={() => setFilters(getDefaultFilters())}
        />
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-[1920px] mx-auto">
        {/* Mobile: Tab switcher */}
        <div className="lg:hidden flex border-b border-stone-200 bg-white">
          <button
            onClick={() => setLayoutMode('list')}
            className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${layoutMode !== 'map' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500'}`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Lijst
          </button>
          <button
            onClick={() => setLayoutMode('map')}
            className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${layoutMode === 'map' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-500'}`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Kaart
          </button>
        </div>

        {/* Desktop split layout */}
        <div className={`flex ${layoutMode === 'map' ? 'hidden lg:flex' : ''}`}>
          {/* Listings panel */}
          <div
            className={`${layoutMode === 'split' ? 'lg:w-1/2 xl:w-[55%]' : layoutMode === 'list' ? 'w-full' : 'hidden lg:block lg:w-1/2 xl:w-[55%]'} overflow-y-auto`}
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            {view === 'saved' && (
              <div className="px-8 py-5 bg-rose-50 border-b border-rose-100">
                <h2 className="text-base font-semibold text-rose-800 flex items-center gap-2">
                  <Heart className="w-5 h-5" fill="currentColor" />
                  Opgeslagen woningen ({savedIds.length})
                </h2>
              </div>
            )}

            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-8">
                <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-stone-400" />
                </div>
                <h3 className="text-xl font-semibold text-stone-700 mb-2">Geen resultaten</h3>
                <p className="text-base text-stone-500 text-center mb-6 max-w-sm">
                  Probeer andere filters of zoektermen om meer woningen te vinden
                </p>
                <button
                  onClick={() => setFilters(getDefaultFilters())}
                  className="px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-5 p-6 ${layoutMode === 'map' ? 'lg:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
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
          <div
            className={`${layoutMode === 'split' ? 'lg:w-1/2 xl:w-[45%]' : layoutMode === 'map' ? 'w-full' : 'hidden lg:block lg:w-1/2 xl:w-[45%]'} sticky top-[140px]`}
            style={{ height: 'calc(100vh - 180px)' }}
          >
            <div className="p-6 h-full">
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

// ============ LISTING CARD ============
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
      className={`group bg-white rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${isSelected ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-100' : 'border-stone-200 hover:border-emerald-200'}`}
      onClick={onSelect}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden rounded-t-2xl">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className={`absolute top-4 left-4 ${statusColors[listing.status]} text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm`}>
          {statusIcons[listing.status]}
          {listing.status}
        </div>

        {/* Mode badge */}
        <div className={`absolute top-4 right-14 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${listing.mode === 'sale' ? 'bg-emerald-600' : 'bg-violet-600'}`}>
          {listing.mode === 'sale' ? 'Te Koop' : 'Te Huur'}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${isSaved ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-sm text-stone-600 hover:bg-rose-500 hover:text-white'}`}
        >
          <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Tags */}
        {listing.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {listing.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-white/95 backdrop-blur-sm text-xs font-medium text-stone-700 px-2.5 py-1 rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-stone-900 line-clamp-1 leading-snug">{listing.title}</h3>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{listing.neighborhood}, {listing.district}</span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-2xl font-bold text-emerald-700 tracking-tight">
            {formatPrice(listing.price, listing.currency, currency)}
          </span>
          {listing.mode === 'rent' && <span className="text-sm text-stone-500">/maand</span>}
          {listing.currency !== currency && (
            <span className="text-xs text-stone-400 ml-2">
              ({formatPrice(listing.price, listing.currency)})
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center gap-5 text-sm text-stone-600 pt-4 border-t border-stone-100">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-stone-400" />
              <span className="font-medium">{listing.bedrooms}</span>
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-stone-400" />
              <span className="font-medium">{listing.bathrooms}</span>
            </span>
          )}
          {listing.livingArea > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-stone-400" />
              <span className="font-medium">{listing.livingArea}m²</span>
            </span>
          )}
          {listing.landSize > 0 && (
            <span className="flex items-center gap-1.5">
              <LandPlot className="w-4 h-4 text-stone-400" />
              <span className="font-medium">{listing.landSize}m²</span>
            </span>
          )}
        </div>

        {/* Property type */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium">
            {listing.propertyType}
          </span>
          {listing.furnished && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              Gemeubileerd
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
