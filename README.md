# SurinameProperty Explorer

A polished, production-quality real estate listing explorer built for the Suriname property market. This application demonstrates strong frontend engineering, UX design, filtering logic, state management, responsive layout, and product thinking — all tailored to a specific regional market.

## 🇸🇷 Market Focus

This app is designed specifically for the **Suriname real estate market**, incorporating:

- **10 districts**: Paramaribo, Wanica, Commewijne, Nickerie, Saramacca, Para, Marowijne, Coronie, Brokopondo, Sipaliwini
- **16 neighborhoods**: Zorg en Hoop, Rainville, Uitvlugt, Latour, Flora, Maretraite, Blauwgrond, Kwatta, Beekhuizen, Tourtonne, Meerzorg, Lelydorp, Domburg, Groningen, Nieuw Nickerie, Albina
- **SRD/USD currency toggle** with static exchange rate (1 USD ≈ 38 SRD, clearly labeled as indicative)
- **Suriname-specific property types**: Houses, apartments, villas, townhouses, commercial, building lots (perceel), agricultural land, vacation homes, student rooms (kamers)
- **Local terminology**: Grondpapieren, erfpacht, eigendom, gemeubileerd
- **WhatsApp as primary contact** (common in the region)
- **Practical amenities**: Generator-ready, water tank, security bars, gated yard

## ✨ Features

### Core Experience
- **33 realistic seeded listings** with full details, images, agent info, and Suriname-specific data
- **Advanced filtering**: 25+ filter options including district, neighborhood, property type, price range, bedrooms, bathrooms, amenities, and market-specific tags
- **Buy/Rent toggle** with dedicated search modes
- **Sort options**: Newest, price ascending/descending, largest, bedrooms
- **Full-text search** across title, address, neighborhood, district, and listing ID

### Map & List Views
- **Custom SVG map** of Suriname with district zones, rivers, and positioned property pins
- **Split layout** (desktop): listings + map side by side
- **Tab layout** (mobile): switch between list and map views
- **Interactive pins**: Click a pin to highlight listing, click listing to highlight pin
- **Color-coded pins**: Green for sale, purple for rent, gold border for saved

### Listing Details
- **Image gallery** with navigation and thumbnails
- **Full property information**: beds, baths, living area, land size, furnished status
- **Amenities list** with checkmarks
- **Ownership/title notes** (grondpapieren, erfpacht details)
- **Nearby landmarks** (schools, supermarkets, bus routes)
- **Agent contact card** with phone, WhatsApp, and contact form
- **Similar properties** section
- **Share and print** buttons

### Saved Properties
- **Heart/save toggle** on every listing card and detail page
- **Dedicated saved view** with filtered results
- **Persisted in localStorage** — survives page refreshes
- **Badge counter** in header

### Calculator
- **Mortgage calculator** (for sale): Home price, down payment %, interest rate, loan term, insurance, tax → monthly payment breakdown
- **Rental calculator** (for rent): Monthly rent, deposit, contract length, utilities → move-in costs and total contract costs
- **Quick select** from actual listings
- **Currency-aware** calculations

### UX Polish
- **Status badges**: New Listing, Price Reduced, Available Immediately, Under Option, Sold, Rented, Open House
- **Tag system**: Good for Expats, Family Friendly, Investment, Pet Friendly, etc.
- **Empty states** with reset action
- **Loading-free** (all data is local)
- **Form validation** with error messages
- **Responsive** across mobile, tablet, and desktop
- **Print-friendly** detail view

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **localStorage** for persistence
- No external APIs, no authentication, no paid services

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app with routing, layout, listing cards
├── types/index.ts             # TypeScript interfaces for all data models
├── data/listings.ts           # 33 realistic Suriname property listings
├── utils/
│   ├── filters.ts             # Filtering, sorting, currency formatting
│   ├── calculator.ts          # Mortgage and rental cost calculations
│   └── storage.ts             # localStorage helpers for saved/recent
├── components/
│   ├── SurinameMap.tsx        # Custom SVG map of Suriname
│   ├── FilterPanel.tsx        # Advanced filter panel with all options
│   ├── ListingDetail.tsx      # Full listing detail page
│   └── Calculator.tsx         # Mortgage/rental calculator
├── index.css                  # Tailwind imports + custom styles
└── main.tsx                   # Entry point
```

## 🚀 Getting Started

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
```

## 🎯 What This Demonstrates

- **Product thinking**: Built for a specific market with real terminology and behaviors
- **Complex state management**: Filters, sorting, saved properties, view modes
- **Responsive design**: Adapts from mobile to ultrawide desktop
- **Component architecture**: Focused, reusable, typed components
- **Data modeling**: Comprehensive TypeScript interfaces
- **Utility functions**: Filtering, sorting, currency conversion, calculations
- **UX patterns**: Empty states, validation, feedback, progressive disclosure
- **No dead code**: Every control is functional, no "coming soon" sections

## 📝 Notes

- Currency conversion uses a **static rate** (1 USD = 38 SRD) clearly labeled as indicative
- Property images are from Unsplash (free, no API key required)
- Map is a custom SVG — no Google Maps or Mapbox API key needed
- All data is seeded locally — no backend required
- WhatsApp links use the `wa.me` short URL format common in the region
