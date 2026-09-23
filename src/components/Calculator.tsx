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

  // Quick select from listings
  const saleListings = listings.filter(l => l.mode === 'sale' && l.propertyType !== 'Building Lot' && l.propertyType !== 'Agricultural Land');
  const rentListings = listings.filter(l => l.mode === 'rent');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalcIcon className="w-5 h-5 text-emerald-600" />
            Kosten Calculator
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 max-w-xs mx-auto">
          <button
            onClick={() => setMode('sale')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'sale' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
          >
            <Home className="w-4 h-4" />
            Koopwoning
          </button>
          <button
            onClick={() => setMode('rent')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'rent' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
          >
            <Key className="w-4 h-4" />
            Huurwoning
          </button>
        </div>

        {/* Currency notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700">
            <strong>Valuta:</strong> Berekeningen worden weergegeven in {currency}. 
            Wisselkoers: 1 USD ≈ {SRD_TO_USD} SRD (indicatief, geen actuele koers).
            <button
              onClick={() => {/* currency toggle handled by parent */}}
              className="ml-2 underline font-medium"
            >
              Huidige weergave: {currency}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === 'sale' ? 'Hypotheek berekenen' : 'Huurkosten berekenen'}
            </h2>

            {mode === 'sale' ? (
              <div className="space-y-4">
                {/* Quick select */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Snelle selectie (optioneel)</label>
                  <select
                    onChange={(e) => {
                      const listing = saleListings.find(l => l.id === e.target.value);
                      if (listing) {
                        const price = currency === 'USD' ? listing.price / SRD_TO_USD : listing.price;
                        setHomePrice(Math.round(price));
                      }
                    }}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    defaultValue=""
                  >
                    <option value="">-- Selecteer een woning --</option>
                    {saleListings.map(l => (
                      <option key={l.id} value={l.id}>{l.title} ({formatPrice(l.price, l.currency, currency)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Koopprijs ({currency})
                  </label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Eigen bijdrage (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-medium">{downPaymentPct}% ({displayCurrency(homePrice * downPaymentPct / 100 * (currency === 'USD' ? SRD_TO_USD : 1))})</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Rente (% per jaar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Looptijd (jaren)</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {[5, 10, 15, 20, 25, 30].map(y => <option key={y} value={y}>{y} jaar</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Verzekering/maand ({currency})</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Belasting/maand ({currency})</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(Number(e.target.value))}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quick select */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Snelle selectie (optioneel)</label>
                  <select
                    onChange={(e) => {
                      const listing = rentListings.find(l => l.id === e.target.value);
                      if (listing) {
                        const rent = currency === 'USD' ? listing.price / SRD_TO_USD : listing.price;
                        setMonthlyRent(Math.round(rent));
                      }
                    }}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    defaultValue=""
                  >
                    <option value="">-- Selecteer een woning --</option>
                    {rentListings.map(l => (
                      <option key={l.id} value={l.id}>{l.title} ({formatPrice(l.price, l.currency, currency)}/mnd)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Maandhuur ({currency})</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Borg (maanden)</label>
                  <select
                    value={depositMonths}
                    onChange={(e) => setDepositMonths(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {[1, 2, 3].map(m => <option key={m} value={m}>{m} maand{m > 1 ? 'en' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Contractduur (maanden)</label>
                  <select
                    value={contractLength}
                    onChange={(e) => setContractLength(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {[6, 12, 24, 36].map(m => <option key={m} value={m}>{m} maanden</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nutsvoorzieningen/maand ({currency})</label>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultaat</h2>
            
            {mode === 'sale' ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Geschatte maandlasten</p>
                  <p className="text-3xl font-bold text-emerald-800">{displayCurrency(mortgageResult.totalMonthlyPayment)}</p>
                  <p className="text-xs text-emerald-600 mt-1">per maand</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Leningbedrag</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(mortgageResult.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Aflossing + rente</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(mortgageResult.monthlyPrincipalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Verzekering</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(mortgageResult.monthlyInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Belasting</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(mortgageResult.monthlyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Totale rente</span>
                    <span className="text-sm font-semibold text-amber-700">{displayCurrency(mortgageResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-900">Totaal te betalen</span>
                    <span className="text-sm font-bold text-gray-900">{displayCurrency(mortgageResult.totalPayment)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-violet-600 font-medium mb-1">Totale instapkosten</p>
                  <p className="text-3xl font-bold text-violet-800">{displayCurrency(rentalResult.totalMoveInCost)}</p>
                  <p className="text-xs text-violet-600 mt-1">borg + eerste maand</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Maandhuur</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(rentalResult.monthlyRent)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Borg ({depositMonths} mnd)</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(rentalResult.deposit)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Nutsvoorzieningen/maand</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(rentalResult.utilities)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Maandelijkse lasten</span>
                    <span className="text-sm font-semibold text-gray-900">{displayCurrency(rentalResult.monthlyRent + rentalResult.utilities)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-900">Totale contractkosten ({contractLength} mnd)</span>
                    <span className="text-sm font-bold text-gray-900">{displayCurrency(rentalResult.totalContractCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 leading-relaxed">
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
