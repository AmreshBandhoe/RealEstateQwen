import React, { useState, useMemo } from 'react';
import { Listing, Currency } from '../types';
import { calculateMortgage, calculateRentalCost } from '../utils/calculator';
import { formatPrice, SRD_TO_USD } from '../utils/filters';
import { ArrowLeft, Calculator as CalcIcon, Home, Key, Info } from 'lucide-react';

interface CalculatorProps {
  onBack: () => void;
  currency: Currency;
  listings: Listing[];
}

export const Calculator: React.FC<CalculatorProps> = ({ onBack, currency, listings }) => {
  const [mode, setMode] = useState<'sale' | 'rent'>('sale');

  // Sale calculator state
  const [homePrice, setHomePrice] = useState(2500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [insurance, setInsurance] = useState(5000);
  const [tax, setTax] = useState(3000);

  // Rent calculator state
  const [monthlyRent, setMonthlyRent] = useState(20000);
  const [depositMonths, setDepositMonths] = useState(2);
  const [contractLength, setContractLength] = useState(12);
  const [utilities, setUtilities] = useState(5000);

  const mortgageResult = useMemo(() => {
    const priceInSRD = currency === 'USD' ? homePrice * SRD_TO_USD : homePrice;
    return calculateMortgage(priceInSRD, downPaymentPct, interestRate, loanTerm, insurance, tax);
  }, [homePrice, downPaymentPct, interestRate, loanTerm, insurance, tax, currency]);

  const rentalResult = useMemo(() => {
    const rentInSRD = currency === 'USD' ? monthlyRent * SRD_TO_USD : monthlyRent;
    return calculateRentalCost(rentInSRD, depositMonths, contractLength, utilities);
  }, [monthlyRent, depositMonths, contractLength, utilities, currency]);

  const displayCurrency = (amount: number) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / SRD_TO_USD).toLocaleString()}`;
    }
    return `SRD ${Math.round(amount).toLocaleString('nl-SR')}`;
  };

  const saleListings = listings.filter(l => l.mode === 'sale' && l.propertyType !== 'Building Lot' && l.propertyType !== 'Agricultural Land');
  const rentListings = listings.filter(l => l.mode === 'rent');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2.5 text-base text-stone-600 hover:text-emerald-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Terug
          </button>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-white" />
            </div>
            Kosten Calculator
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Mode Toggle */}
        <div className="flex bg-stone-100 rounded-2xl p-1.5 mb-10 max-w-md mx-auto">
          <button
            onClick={() => setMode('sale')}
            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold rounded-xl transition-all ${mode === 'sale' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-600'}`}
          >
            <Home className="w-5 h-5" />
            Koopwoning
          </button>
          <button
            onClick={() => setMode('rent')}
            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold rounded-xl transition-all ${mode === 'rent' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-600'}`}
          >
            <Key className="w-5 h-5" />
            Huurwoning
          </button>
        </div>

        {/* Currency notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">Valuta:</strong> Berekeningen worden weergegeven in {currency}.
            Wisselkoers: 1 USD ≈ {SRD_TO_USD} SRD (indicatief, geen actuele koers).
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">
              {mode === 'sale' ? 'Hypotheek berekenen' : 'Huurkosten berekenen'}
            </h2>

            {mode === 'sale' ? (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Snelle selectie (optioneel)</label>
                  <select
                    onChange={(e) => {
                      const listing = saleListings.find(l => l.id === e.target.value);
                      if (listing) {
                        const price = currency === 'USD' ? listing.price / SRD_TO_USD : listing.price;
                        setHomePrice(Math.round(price));
                      }
                    }}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                    defaultValue=""
                  >
                    <option value="">-- Selecteer een woning --</option>
                    {saleListings.map(l => (
                      <option key={l.id} value={l.id}>{l.title} ({formatPrice(l.price, l.currency, currency)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">
                    Koopprijs ({currency})
                  </label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Eigen bijdrage (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2"
                  />
                  <div className="flex justify-between text-sm text-stone-500 mt-2">
                    <span>0%</span>
                    <span className="font-semibold text-stone-700">{downPaymentPct}% ({displayCurrency(homePrice * downPaymentPct / 100 * (currency === 'USD' ? SRD_TO_USD : 1))})</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Rente (% per jaar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Looptijd (jaren)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  >
                    {[5, 10, 15, 20, 25, 30].map(y => <option key={y} value={y}>{y} jaar</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-2 block">Verzekering/maand ({currency})</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(Number(e.target.value))}
                      className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-stone-700 mb-2 block">Belasting/maand ({currency})</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(Number(e.target.value))}
                      className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Snelle selectie (optioneel)</label>
                  <select
                    onChange={(e) => {
                      const listing = rentListings.find(l => l.id === e.target.value);
                      if (listing) {
                        const rent = currency === 'USD' ? listing.price / SRD_TO_USD : listing.price;
                        setMonthlyRent(Math.round(rent));
                      }
                    }}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                    defaultValue=""
                  >
                    <option value="">-- Selecteer een woning --</option>
                    {rentListings.map(l => (
                      <option key={l.id} value={l.id}>{l.title} ({formatPrice(l.price, l.currency, currency)}/mnd)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Maandhuur ({currency})</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Borg (maanden)</label>
                  <select
                    value={depositMonths}
                    onChange={(e) => setDepositMonths(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  >
                    {[1, 2, 3].map(m => <option key={m} value={m}>{m} maand{m > 1 ? 'en' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Contractduur (maanden)</label>
                  <select
                    value={contractLength}
                    onChange={(e) => setContractLength(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  >
                    {[6, 12, 24, 36].map(m => <option key={m} value={m}>{m} maanden</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Nutsvoorzieningen/maand ({currency})</label>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    className="w-full text-base border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 bg-stone-50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Resultaat</h2>

            {mode === 'sale' ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <p className="text-sm text-emerald-600 font-semibold mb-2">Geschatte maandlasten</p>
                  <p className="text-4xl font-bold text-emerald-800 tracking-tight">{displayCurrency(mortgageResult.totalMonthlyPayment)}</p>
                  <p className="text-sm text-emerald-600 mt-2">per maand</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Leningbedrag</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(mortgageResult.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Aflossing + rente</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(mortgageResult.monthlyPrincipalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Verzekering</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(mortgageResult.monthlyInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Belasting</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(mortgageResult.monthlyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Totale rente</span>
                    <span className="text-base font-semibold text-amber-700">{displayCurrency(mortgageResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-stone-50 rounded-xl px-4 -mx-1">
                    <span className="text-base font-semibold text-stone-900">Totaal te betalen</span>
                    <span className="text-lg font-bold text-stone-900">{displayCurrency(mortgageResult.totalPayment)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-8 text-center">
                  <p className="text-sm text-violet-600 font-semibold mb-2">Totale instapkosten</p>
                  <p className="text-4xl font-bold text-violet-800 tracking-tight">{displayCurrency(rentalResult.totalMoveInCost)}</p>
                  <p className="text-sm text-violet-600 mt-2">borg + eerste maand</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Maandhuur</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(rentalResult.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Borg ({depositMonths} mnd)</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(rentalResult.deposit)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Nutsvoorzieningen/maand</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(rentalResult.utilities)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-base text-stone-600">Maandelijkse lasten</span>
                    <span className="text-base font-semibold text-stone-900">{displayCurrency(rentalResult.monthlyRent + rentalResult.utilities)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-stone-50 rounded-xl px-4 -mx-1">
                    <span className="text-base font-semibold text-stone-900">Totale contractkosten ({contractLength} mnd)</span>
                    <span className="text-lg font-bold text-stone-900">{displayCurrency(rentalResult.totalContractCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-xs text-stone-400 leading-relaxed">
                * Deze berekening is indicatief en gebaseerd op de ingevoerde gegevens.
                Werkelijke kosten kunnen afwijken. Raadpleeg een financieel adviseur of bank
                voor een exacte offerte. Wisselkoers is vast ingesteld op 1 USD = {SRD_TO_USD} SRD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
