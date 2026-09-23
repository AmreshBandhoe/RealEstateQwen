import React, { useState } from 'react';
import { Listing, Currency } from '../types';
import { formatPrice } from '../utils/filters';
import {
  ArrowLeft, Heart, MapPin, Bed, Bath, Maximize, LandPlot,
  Phone, MessageCircle, Mail, ChevronLeft, ChevronRight, Share2,
  Printer, Calendar, Tag, Home, Check
} from 'lucide-react';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  onSave: (id: string) => void;
  isSaved: boolean;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  similarListings: Listing[];
  onSelectSimilar: (id: string) => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({
  listing, onBack, onSave, isSaved, currency, onCurrencyChange, similarListings, onSelectSimilar
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Naam is verplicht';
    if (!formData.email.trim()) errors.email = 'Email is verplicht';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Ongeldig emailadres';
    if (!formData.phone.trim()) errors.phone = 'Telefoon is verplicht';
    if (!formData.message.trim()) errors.message = 'Bericht is verplicht';
    
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
      setTimeout(() => { setFormSubmitted(false); setShowContactForm(false); }, 3000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, text: listing.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link gekopieerd!');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hallo, ik ben geïnteresseerd in listing ${listing.id}: "${listing.title}" (${formatPrice(listing.price, listing.currency, currency)}). Is deze nog beschikbaar?`
  );
  const whatsappUrl = `https://wa.me/${listing.agent.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar resultaten
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Delen">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => window.print()} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Printen">
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSave(listing.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isSaved ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600'}`}
            >
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Opgeslagen' : 'Opslaan'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[16/9]">
              <img
                src={listing.images[currentImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((currentImage - 1 + listing.images.length) % listing.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((currentImage + 1) % listing.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {listing.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Status badge */}
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {listing.status}
              </div>
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${i === currentImage ? 'border-emerald-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.address}, {listing.neighborhood}, {listing.district}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-emerald-700">
                    {formatPrice(listing.price, listing.currency, currency)}
                  </div>
                  {listing.mode === 'rent' && <div className="text-sm text-gray-500">per maand</div>}
                  <button
                    onClick={() => onCurrencyChange(currency === 'SRD' ? 'USD' : 'SRD')}
                    className="text-xs text-emerald-600 hover:underline mt-1"
                  >
                    Toon in {currency === 'SRD' ? 'USD' : 'SRD'}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {listing.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${listing.mode === 'sale' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                  {listing.mode === 'sale' ? 'Te Koop' : 'Te Huur'}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {listing.propertyType}
                </span>
                {listing.furnished && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    Gemeubileerd
                  </span>
                )}
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {listing.bedrooms > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{listing.bedrooms}</div>
                  <div className="text-xs text-gray-500">Slaapkamers</div>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{listing.bathrooms}</div>
                  <div className="text-xs text-gray-500">Badkamers</div>
                </div>
              )}
              {listing.livingArea > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <Maximize className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{listing.livingArea}</div>
                  <div className="text-xs text-gray-500">Woonopp. m²</div>
                </div>
              )}
              {listing.landSize > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <LandPlot className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{listing.landSize}</div>
                  <div className="text-xs text-gray-500">Perceel m²</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Beschrijving</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                Beschikbaar: {new Date(listing.availabilityDate).toLocaleDateString('nl-SR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {listing.yearBuilt && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <Home className="w-3.5 h-3.5" />
                  Bouwjaar: {listing.yearBuilt}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Voorzieningen</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {listing.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Title/Ownership Notes */}
            {listing.titleNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Eigendomsinformatie
                </h2>
                <p className="text-sm text-amber-800">{listing.titleNotes}</p>
              </div>
            )}

            {/* Nearby Landmarks */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">In de buurt</h2>
              <div className="space-y-2">
                {listing.nearbyLandmarks.map(landmark => (
                  <div key={landmark} className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    {landmark}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Agent Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact makelaar</h3>
              <div className="mb-4">
                <p className="font-medium text-gray-900">{listing.agent.name}</p>
                <p className="text-sm text-gray-500">{listing.agent.company}</p>
                <p className="text-sm text-gray-600 mt-1">{listing.agent.phone}</p>
              </div>

              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${listing.agent.phone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Bel makelaar
                </a>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Stuur bericht
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {formSubmitted ? (
                    <div className="text-center py-4">
                      <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-emerald-700">Bericht verzonden!</p>
                      <p className="text-xs text-gray-500 mt-1">De makelaar neemt spoedig contact op.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Uw naam *"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${formErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {formErrors.name && <p className="text-xs text-red-500 mt-0.5">{formErrors.name}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Uw email *"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {formErrors.email && <p className="text-xs text-red-500 mt-0.5">{formErrors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Telefoonnummer *"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${formErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {formErrors.phone && <p className="text-xs text-red-500 mt-0.5">{formErrors.phone}</p>}
                      </div>
                      <div>
                        <textarea
                          placeholder="Uw bericht *"
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${formErrors.message ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {formErrors.message && <p className="text-xs text-red-500 mt-0.5">{formErrors.message}</p>}
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Verstuur bericht
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Similar Properties */}
            {similarListings.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Vergelijkbare woningen</h3>
                <div className="space-y-3">
                  {similarListings.map(similar => (
                    <button
                      key={similar.id}
                      onClick={() => onSelectSimilar(similar.id)}
                      className="w-full flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <img src={similar.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{similar.title}</p>
                        <p className="text-xs text-emerald-700 font-semibold">{formatPrice(similar.price, similar.currency, currency)}</p>
                        <p className="text-[10px] text-gray-500">{similar.neighborhood}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
