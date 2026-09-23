import { Listing, Filters, Currency } from '../types';

// Exchange rate: 1 USD = ~38 SRD (mocked static rate)
export const SRD_TO_USD = 38;

export function formatPrice(price: number, currency: 'SRD' | 'USD', displayCurrency?: Currency): string {
  const display = displayCurrency || currency;
  let amount = price;
  
  if (currency === 'SRD' && display === 'USD') {
    amount = price / SRD_TO_USD;
  } else if (currency === 'USD' && display === 'SRD') {
    amount = price * SRD_TO_USD;
  }

  if (display === 'USD') {
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `SRD ${amount.toLocaleString('nl-SR', { maximumFractionDigits: 0 })}`;
}

export function convertPrice(price: number, fromCurrency: 'SRD' | 'USD', toCurrency: Currency): number {
  if (fromCurrency === toCurrency) return price;
  if (fromCurrency === 'SRD' && toCurrency === 'USD') return price / SRD_TO_USD;
  if (fromCurrency === 'USD' && toCurrency === 'SRD') return price * SRD_TO_USD;
  return price;
}

export function applyFilters(listings: Listing[], filters: Filters): Listing[] {
  return listings.filter((listing) => {
    // Mode filter
    if (filters.mode !== 'all' && listing.mode !== filters.mode) return false;
    
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = `${listing.title} ${listing.address} ${listing.neighborhood} ${listing.district} ${listing.id}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    
    // District filter
    if (filters.district !== 'all' && listing.district !== filters.district) return false;
    
    // Neighborhood filter
    if (filters.neighborhood !== 'all' && listing.neighborhood !== filters.neighborhood) return false;
    
    // Property type filter
    if (filters.propertyType !== 'all' && listing.propertyType !== filters.propertyType) return false;
    
    // Status filter
    if (filters.status !== 'all' && listing.status !== filters.status) return false;
    
    // Price range (convert to display currency for comparison)
    const priceInDisplayCurrency = convertPrice(listing.price, listing.currency, filters.currency);
    if (filters.priceMin > 0 && priceInDisplayCurrency < filters.priceMin) return false;
    if (filters.priceMax > 0 && priceInDisplayCurrency > filters.priceMax) return false;
    
    // Bedrooms
    if (filters.bedroomsMin > 0 && listing.bedrooms < filters.bedroomsMin) return false;
    
    // Bathrooms
    if (filters.bathroomsMin > 0 && listing.bathrooms < filters.bathroomsMin) return false;
    
    // Living area
    if (filters.livingAreaMin > 0 && listing.livingArea < filters.livingAreaMin) return false;
    
    // Land size
    if (filters.landSizeMin > 0 && listing.landSize < filters.landSizeMin) return false;
    
    // Furnished
    if (filters.furnished !== null && listing.furnished !== filters.furnished) return false;
    
    // Amenity filters
    if (filters.parking && !listing.amenities.some(a => a.toLowerCase().includes('parking'))) return false;
    if (filters.airConditioning && !listing.amenities.some(a => a.toLowerCase().includes('air conditioning'))) return false;
    if (filters.gatedYard && !listing.amenities.some(a => a.toLowerCase().includes('gated'))) return false;
    if (filters.securityBars && !listing.amenities.some(a => a.toLowerCase().includes('security'))) return false;
    if (filters.generatorReady && !listing.amenities.some(a => a.toLowerCase().includes('generator'))) return false;
    if (filters.waterTank && !listing.amenities.some(a => a.toLowerCase().includes('water tank'))) return false;
    if (filters.hotWater && !listing.amenities.some(a => a.toLowerCase().includes('hot water'))) return false;
    if (filters.internetReady && !listing.amenities.some(a => a.toLowerCase().includes('internet'))) return false;
    
    // Tag-based filters
    if (filters.nearSchools && !listing.nearbyLandmarks.some(l => l.toLowerCase().includes('school'))) return false;
    if (filters.nearSupermarkets && !listing.nearbyLandmarks.some(l => l.toLowerCase().includes('supermarket') || l.toLowerCase().includes('market') || l.toLowerCase().includes('shop'))) return false;
    if (filters.nearBusRoute && !listing.nearbyLandmarks.some(l => l.toLowerCase().includes('bus'))) return false;
    if (filters.petFriendly && !listing.tags.includes('Pet Friendly')) return false;
    if (filters.suitableForExpats && !listing.tags.includes('Good for Expats')) return false;
    if (filters.suitableForStudents && !listing.tags.includes('Suitable for Students')) return false;
    if (filters.commercialZoning && !listing.tags.includes('Commercial Zoning')) return false;
    if (filters.clearTitle && !listing.tags.includes('Clear Title')) return false;
    
    return true;
  });
}

export function sortListings(listings: Listing[], sortBy: string, currency: Currency): Listing[] {
  const sorted = [...listings];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => convertPrice(a.price, a.currency, currency) - convertPrice(b.price, b.currency, currency));
    case 'price-desc':
      return sorted.sort((a, b) => convertPrice(b.price, b.currency, currency) - convertPrice(a.price, a.currency, currency));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.availabilityDate).getTime() - new Date(a.availabilityDate).getTime());
    case 'largest':
      return sorted.sort((a, b) => (b.livingArea || b.landSize) - (a.livingArea || a.landSize));
    case 'bedrooms':
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
    default:
      return sorted;
  }
}

export function getDefaultFilters(): Filters {
  return {
    mode: 'all',
    searchQuery: '',
    district: 'all',
    neighborhood: 'all',
    propertyType: 'all',
    priceMin: 0,
    priceMax: 0,
    currency: 'SRD',
    bedroomsMin: 0,
    bathroomsMin: 0,
    livingAreaMin: 0,
    landSizeMin: 0,
    furnished: null,
    parking: false,
    airConditioning: false,
    gatedYard: false,
    securityBars: false,
    generatorReady: false,
    waterTank: false,
    hotWater: false,
    internetReady: false,
    nearSchools: false,
    nearSupermarkets: false,
    nearBusRoute: false,
    petFriendly: false,
    suitableForExpats: false,
    suitableForStudents: false,
    commercialZoning: false,
    clearTitle: false,
    status: 'all',
  };
}
