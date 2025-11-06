import { gql } from "@apollo/client";

export const GET_ASSETS = gql`
  query GetAssets($wid: String!) {
    getAssets(wid: $wid) {
      assetId
      assetInfo
      assetInfoType
      balanceAsOf
      balanceCostBasis
      balanceCurrent
      balanceQuantityCurrent
      balancePrice
      cognitoId
      creationDate
      descriptionEstatePlan
      holdings {
        majorAssetClasses {
          majorClass
          assetClasses {
            minorAssetClass
            value
          }
        }
      }
      includeInNetWorth
      institutionId
      isActive
      isAsset
      isFavorite
      lastUpdate
      lastUpdateAttempt
      modificationDate
      nickname
      note
      ownership
      primaryAssetCategory
      status
      statusCode
      userInstitutionId
      wealthAssetType
      wid
    }
  }
`;

export const GET_ASSET = gql`
  query GetAsset($assetId: ID!) {
    asset(assetId: $assetId) {
      assetId
      assetInfo
      assetInfoType
      balanceAsOf
      balanceCostBasis
      balanceCurrent
      balanceQuantityCurrent
      balancePrice
      cognitoId
      creationDate
      descriptionEstatePlan
      holdings {
        majorAssetClasses {
          majorClass
          assetClasses {
            minorAssetClass
            value
          }
        }
      }
      includeInNetWorth
      institutionId
      isActive
      isAsset
      isFavorite
      lastUpdate
      lastUpdateAttempt
      modificationDate
      nickname
      note
      ownership
      primaryAssetCategory
      status
      statusCode
      userInstitutionId
      wealthAssetType
      wid
    }
  }
`;
