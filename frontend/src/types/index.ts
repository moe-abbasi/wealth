export interface AssetClass {
  minorAssetClass: string;
  value: number;
}

export interface MajorAssetClass {
  majorClass: string;
  assetClasses: AssetClass[];
}

export interface Holdings {
  majorAssetClasses: MajorAssetClass[];
}

export interface Asset {
  assetId: string;
  assetInfo: string;
  assetInfoType: string;
  balanceAsOf: string;
  balanceCostBasis: number;
  balanceCurrent: number;
  balanceQuantityCurrent: number | null;
  cognitoId: string;
  creationDate: string;
  descriptionEstatePlan: string;
  holdings: Holdings | null;
  includeInNetWorth: boolean;
  institutionId: number;
  isActive: boolean;
  isAsset: boolean;
  isFavorite: boolean;
  lastUpdate: string;
  lastUpdateAttempt: string;
  modificationDate: string;
  nickname: string;
  note: string | null;
  ownership: string | null;
  primaryAssetCategory: string;
  status: string | null;
  statusCode: string | null;
  userInstitutionId: string;
  wealthAssetType: string;
  wid: string;
  balancePrice?: number | null;
}

export interface AssetInfo {
  nickname?: string;
  estimateValue?: number;
  purchaseCost?: number;
  asOfDate?: string;
  isFavorite?: boolean;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  countryCode?: string;
  purchaseDate?: string;
  quantity?: number;
  cryptocurrencyName?: string;
  symbol?: string;
  modelYear?: number;
  [key: string]: any;
}

export type TabValue = 'overview' | 'holdings' | 'details';
