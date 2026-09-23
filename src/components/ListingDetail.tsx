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
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2.5 text-base text-stone-600 hover:text-emerald-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Terug naar resultaten
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-3 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors" title="Delen">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => window.print()} className="p-3 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors" title="Printen">
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSave(listing.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all ${isSaved ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200' : 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600'}`}
            >
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Opgeslagen' : 'Opslaan'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-200 aspect-[16/10] shadow-lg">
              <img
                src={listing.images[currentImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((currentImage - 1 + listing.images.length) % listing.images.length)}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((currentImage + 1) % listing.images.length)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? 'bg-white scale-110' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Status badge */}
              <div className="absolute top-5 left-5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {listing.status}
              </div>
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-3">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === currentImage ? 'border-emerald-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price */}
            <div className="pb-8 border-b border-stone-200">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-3 leading-tight tracking-tight">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-base text-stone-500">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.address}, {listing.neighborhood}, {listing.district}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-3xl lg:text-4xl font-bold text-emerald-700 tracking-tight">
                    {formatPrice(listing.price, listing.currency, currency)}
                  </div>
                  {listing.mode === 'rent' && <div className="text-base text-stone-500 mt-1">per maand</div>}
                  <button
                    onClick={() => onCurrencyChange(currency === 'SRD' ? 'USD' : 'SRD')}
                    className="text-sm text-emerald-600 hover:underline mt-2 font-medium"
                  >
                    Toon in {currency === 'SRD' ? 'USD' : 'SRD'}
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                {listing.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                    {tag}
                  </span>
                ))}
                <span className={`px-3 py-1.5 text-sm font-medium rounded-full border ${listing.mode === 'sale' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-violet-100 text-violet-700 border-violet-200'}`}>
                  {listing.mode === 'sale' ? 'Te Koop' : 'Te Huur'}
                </span>
                <span className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-medium rounded-full border border-stone-200">
                  {listing.propertyType}
                </span>
                {listing.furnished && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    Gemeubileerd
                  </span>
                )}
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listing.bedrooms > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
                  <Bed className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{listing.bedrooms}</div>
                  <div className="text-sm text-stone-500 mt-0.5">Slaapkamers</div>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
                  <Bath className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{listing.bathrooms}</div>
                  <div className="text-sm text-stone-500 mt-0.5">Badkamers</div>
                </div>
              )}
              {listing.livingArea > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
                  <Maximize className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{listing.livingArea}</div>
                  <div className="text-sm text-stone-500 mt-0.5">Woonopp. m²</div>
                </div>
              )}
              {listing.landSize > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
                  <LandPlot className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{listing.landSize}</div>
                  <div className="text-sm text-stone-500 mt-0.5">Perceel m²</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-5">Beschrijving</h2>
              <p className="text-base text-stone-700 leading-relaxed">{listing.description}</p>

              <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap gap-6 text-sm text-stone-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Beschikbaar: {new Date(listing.availabilityDate).toLocaleDateString('nl-SR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {listing.yearBuilt && (
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Bouwjaar: {listing.yearBuilt}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-5">Voorzieningen</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-base text-stone-700 py-1">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Title/Ownership Notes */}
            {listing.titleNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3">
                  <Tag className="w-6 h-6" />
                  Eigendomsinformatie
                </h2>
                <p className="text-base text-amber-800 leading-relaxed">{listing.titleNotes}</p>
              </div>
            )}

            {/* Nearby Landmarks */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-5">In de buurt</h2>
              <div className="space-y-3">
                {listing.nearbyLandmarks.map(landmark => (
                  <div key={landmark} className="flex items-center gap-3 text-base text-stone-700">
                    <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-stone-500" />
                    </div>
                    {landmark}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-7 sticky top-24 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-5">Contact makelaar</h3>
              <div className="mb-6">
                <p className="text-lg font-semibold text-stone-900">{listing.agent.name}</p>
                <p className="text-base text-stone-500 mt-1">{listing.agent.company}</p>
                <p className="text-base text-stone-700 mt-2 font-medium">{listing.agent.phone}</p>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-green-600 text-white text-base font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${listing.agent.phone}`}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-stone-100 text-stone-700 text-base font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Bel makelaar
                </a>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600 text-white text-base font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Mail className="w-5 h-5" />
                  Stuur bericht
                </button>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="mt-6 pt-6 border-t border-stone-100">
                  {formSubmitted ? (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-7 h-7 text-emerald-600" />
                      </div>
                      <p className="text-lg font-semibold text-emerald-700">Bericht verzonden!</p>
                      <p className="text-sm text-stone-500 mt-1">De makelaar neemt spoedig contact op.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Uw naam *"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full text-base border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50 ${formErrors.name ? 'border-red-300' : 'border-stone-200'}`}
                        />
                        {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Uw email *"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full text-base border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50 ${formErrors.email ? 'border-red-300' : 'border-stone-200'}`}
                        />
                        {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Telefoonnummer *"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full text-base border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50 ${formErrors.phone ? 'border-red-300' : 'border-stone-200'}`}
                        />
                        {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                      </div>
                      <div>
                        <textarea
                          placeholder="Uw bericht *"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`w-full text-base border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none bg-stone-50 ${formErrors.message ? 'border-red-300' : 'border-stone-200'}`}
                        />
                        {formErrors.message && <p className="text-sm text-red-500 mt-1">{formErrors.message}</p>}
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-600 text-white text-base font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
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
              <div className="bg-white border border-stone-200 rounded-2xl p-7">
                <h3 className="text-lg font-bold text-stone-900 mb-5">Vergelijkbare woningen</h3>
                <div className="space-y-4">
                  {similarListings.map(similar => (
                    <button
                      key={similar.id}
                      onClick={() => onSelectSimilar(similar.id)}
                      className="w-full flex gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left"
                    >
                      <img src={similar.images[0]} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-900 truncate">{similar.title}</p>
                        <p className="text-base text-emerald-700 font-bold mt-1">{formatPrice(similar.price, similar.currency, currency)}</p>
                        <p className="text-xs text-stone-500 mt-1">{similar.neighborhood}</p>
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
