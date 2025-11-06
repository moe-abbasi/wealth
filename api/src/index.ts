import express from "express";
import { ApolloServer } from "apollo-server-express";
import { gql } from "apollo-server-express";
import { readFileSync } from "fs";
import { join } from "path";
import helmet from "helmet";
import cors from "cors";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

// Read assets data
const assetsData = JSON.parse(
  readFileSync(join(__dirname, "data/assets.json"), "utf-8")
);

// Initialize express
const app = express();

// Configure security middleware
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

// We'll define the schema and resolvers here
const typeDefs = gql`
  type MinorAssetClass {
    minorAssetClass: String
    value: Float
  }

  type MajorAssetClass {
    assetClasses: [MinorAssetClass]
    majorClass: String
  }

  type Holdings {
    majorAssetClasses: [MajorAssetClass]
  }

  type Asset {
    assetDescription: String
    assetId: String
    assetInfo: String
    assetInfoType: String
    assetMask: String
    assetName: String
    assetOwnerName: String
    balanceAsOf: String
    balanceCostBasis: Float
    balanceCostFrom: String
    balanceCurrent: Float
    balanceFrom: String
    balancePrice: Float
    balancePriceFrom: String
    balanceQuantityCurrent: Float
    beneficiaryComposition: String
    cognitoId: String
    creationDate: String
    currencyCode: String
    deactivateBy: String
    descriptionEstatePlan: String
    hasInvestment: String
    holdings: Holdings
    includeInNetWorth: Boolean
    institutionId: Int
    institutionName: String
    integration: String
    integrationAccountId: String
    isActive: Boolean
    isAsset: Boolean
    isFavorite: Boolean
    isLinkedVendor: String
    lastUpdate: String
    lastUpdateAttempt: String
    logoName: String
    modificationDate: String
    nextUpdate: String
    nickname: String
    note: String
    noteDate: String
    ownership: String
    primaryAssetCategory: String
    status: String
    statusCode: String
    userInstitutionId: String
    vendorAccountType: String
    vendorContainer: String
    vendorResponse: String
    vendorResponseType: String
    wealthAssetType: String
    wid: String
  }

  type Query {
    getAssets(wid: String!): [Asset]
  }
`;

const resolvers = {
  Query: {
    getAssets: (_: any, { wid }: { wid: string }) => {
      if (!wid) {
        throw new Error("WID is required");
      }
      const assets = assetsData.filter(
        (asset: { wid: string }) => asset.wid === wid
      );
      if (!assets.length) {
        return [];
      }
      return assets;
    },
  },
};

async function startApolloServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({})],
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    },
  });

  // Start the server
  await server.start();

  // Configure CORS and index page redirect
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    if (req.path === "/") {
      res.redirect("/graphql");
      return;
    }
    next();
  });

  // Apply middleware
  server.applyMiddleware({
    app: app as any,
    cors: {
      origin: "*",
      credentials: false,
    },
  });

  // Start listening
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

// Start the server
startApolloServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
