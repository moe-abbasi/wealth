import { Asset, AssetInfo } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const parseAssetInfo = (assetInfoString: string): AssetInfo => {
  try {
    return JSON.parse(assetInfoString);
  } catch {
    return {};
  }
};

export const calculateNetWorth = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => {
    if (asset.includeInNetWorth) {
      return total + asset.balanceCurrent;
    }
    return total;
  }, 0);
};

export const getAssetCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    Cash: 'Cash',
    Investment: 'Investment',
    RealEstate: 'Real Estate',
    OtherProperty: 'Other Property',
  };
  return labels[category] || category;
};

export const getAssetTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    Cash: 'Cash',
    Cryptocurrency: 'Cryptocurrency',
    Vehicle: 'Vehicle',
    RealEstate: 'Real Estate',
    Brokerage: 'Brokerage',
  };
  return labels[type] || type;
};

export const getMajorClassLabel = (majorClass: string): string => {
  const labels: Record<string, string> = {
    CashDepositsMoneyMarketFunds: 'Cash Deposits Money Market Funds',
    FixedIncome: 'Fixed Income',
    PublicEquity: 'Public Equity',
    AlternativeInvestments: 'Alternative Investments',
    OtherInvestments: 'Other Investments',
    Liabilities: 'Liabilities',
  };
  return labels[majorClass] || majorClass;
};

export const getMinorClassLabel = (minorClass: string): string => {
  const labels: Record<string, string> = {
    Cash: 'Cash',
    DepositsMoneyMarketFunds: 'Deposits/Money Market Funds',
    InvestmentGradeFixedIncome: 'Investment Grade Fixed Income',
    HybridFixedIncome: 'Hybrid Fixed Income',
    OtherFixedIncome: 'Other Fixed Income',
    UsEquity: 'US Equity',
    NonUsEquity: 'Non-US Equity',
    GlobalEquity: 'Global Equity',
    IncomeOrientedEquity: 'Income Oriented Equity',
    OtherEquity: 'Other Equity',
    PrivateEquity: 'Private Equity',
    HedgeFunds: 'Hedge Funds',
    RealEstate: 'Real Estate',
    Commodities: 'Commodities',
    VentureCapital: 'Venture Capital',
    PersonalRealEstate: 'Personal Real Estate',
    Other: 'Other',
    AssetAllocation: 'Asset Allocation',
    Miscellaneous: 'Miscellaneous',
    CreditCard: 'Credit Card',
    Loan: 'Loan',
    IntraFamilyLoan: 'Intra-Family Loan',
    OtherLiability: 'Other Liability',
    ResidentialMortgages: 'Residential Mortgages',
    SecurityBasedLoans: 'Security Based Loans',
    StructuredLoans: 'Structured Loans',
  };
  return labels[minorClass] || minorClass;
};
