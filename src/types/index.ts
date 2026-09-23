export type District =
  | 'Paramaribo'
  | 'Wanica'
  | 'Commewijne'
  | 'Nickerie'
  | 'Saramacca'
  | 'Para'
  | 'Marowijne'
  | 'Coronie'
  | 'Brokopondo'
  | 'Sipaliwini';

export type Neighborhood =
  | 'Zorg en Hoop'
  | 'Rainville'
  | 'Uitvlugt'
  | 'Latour'
  | 'Flora'
  | 'Maretraite'
  | 'Blauwgrond'
  | 'Kwatta'
  | 'Beekhuizen'
  | 'Tourtonne'
  | 'Meerzorg'
  | 'Lelydorp'
  | 'Domburg'
  | 'Groningen'
  | 'Nieuw Nickerie'
  | 'Albina';

export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Villa'
  | 'Townhouse'
  | 'Commercial'
  | 'Building Lot'
  | 'Agricultural Land'
  | 'Vacation Home'
  | 'Student Room';

export type ListingMode = 'sale' | 'rent';

export type ListingStatus =
  | 'New Listing'
  | 'Price Reduced'
  | 'Available Immediately'
  | 'Under Option'
  | 'Sold'
  | 'Rented'
  | 'Open House';

export type Currency = 'SRD' | 'USD';

export interface Listing {
  id: string;
  title: string;
  district: District;
  neighborhood: Neighborhood;
  address: string;
  mode: ListingMode;
  propertyType: PropertyType;
  price: number;
  currency: 'SRD' | 'USD';
  bedrooms: number;
  bathrooms: number;
  livingArea: number; // m²
  landSize: number; // m²
  furnished: boolean;
  availabilityDate: string;
  status: ListingStatus;
  description: string;
  amenities: string[];
  agent: {
    name: string;
    company: string;
    phone: string;
    whatsapp: string;
  };
  images: string[];
  coordinates: { lat: number; lng: number }; // real GPS coordinates
  titleNotes?: string;
  nearbyLandmarks: string[];
  tags: string[];
  yearBuilt?: number;
}

export interface Filters {
  mode: ListingMode | 'all';
  searchQuery: string;
  district: District | 'all';
  neighborhood: Neighborhood | 'all';
  propertyType: PropertyType | 'all';
  priceMin: number;
  priceMax: number;
  currency: Currency;
  bedroomsMin: number;
  bathroomsMin: number;
  livingAreaMin: number;
  landSizeMin: number;
  furnished: boolean | null;
  parking: boolean;
  airConditioning: boolean;
  gatedYard: boolean;
  securityBars: boolean;
  generatorReady: boolean;
  waterTank: boolean;
  hotWater: boolean;
  internetReady: boolean;
  nearSchools: boolean;
  nearSupermarkets: boolean;
  nearBusRoute: boolean;
  petFriendly: boolean;
  suitableForExpats: boolean;
  suitableForStudents: boolean;
  commercialZoning: boolean;
  clearTitle: boolean;
  status: ListingStatus | 'all';
}

export interface CalculatorInputs {
  // Sale
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  insurance: number;
  tax: number;
  // Rent
  monthlyRent: number;
  deposit: number;
  contractLength: number;
  utilities: number;
}
