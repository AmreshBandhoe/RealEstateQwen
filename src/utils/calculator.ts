export interface MortgageResult {
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyInsurance: number;
  monthlyTax: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface RentalResult {
  monthlyRent: number;
  deposit: number;
  firstMonthRent: number;
  utilities: number;
  totalMoveInCost: number;
  totalContractCost: number;
}

export function calculateMortgage(
  homePrice: number,
  downPaymentPercent: number,
  annualRate: number,
  termYears: number,
  monthlyInsurance: number = 0,
  monthlyTax: number = 0
): MortgageResult {
  const downPayment = homePrice * (downPaymentPercent / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  let monthlyPrincipalInterest = 0;
  if (monthlyRate > 0) {
    monthlyPrincipalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPrincipalInterest = loanAmount / numPayments;
  }
  
  const totalPayment = monthlyPrincipalInterest * numPayments;
  const totalInterest = totalPayment - loanAmount;
  
  return {
    loanAmount,
    monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyTax: Math.round(monthlyTax),
    totalMonthlyPayment: Math.round(monthlyPrincipalInterest + monthlyInsurance + monthlyTax),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment + (monthlyInsurance + monthlyTax) * numPayments),
  };
}

export function calculateRentalCost(
  monthlyRent: number,
  depositMonths: number,
  contractLengthMonths: number,
  monthlyUtilities: number = 0
): RentalResult {
  const deposit = monthlyRent * depositMonths;
  const firstMonthRent = monthlyRent;
  const totalMoveInCost = deposit + firstMonthRent;
  const totalContractCost = (monthlyRent + monthlyUtilities) * contractLengthMonths;
  
  return {
    monthlyRent: Math.round(monthlyRent),
    deposit: Math.round(deposit),
    firstMonthRent: Math.round(firstMonthRent),
    utilities: Math.round(monthlyUtilities),
    totalMoveInCost: Math.round(totalMoveInCost),
    totalContractCost: Math.round(totalContractCost),
  };
}
