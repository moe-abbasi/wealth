import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AssetTable } from "./components/AssetTable";
import { AssetModal } from "./components/AssetModal";
import { GET_ASSETS } from "./graphql/queries";
import { Asset } from "./types";
import { calculateNetWorth, formatCurrency } from "./utils/formatters";

function App() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_ASSETS, {
    variables: { wid: "ae0df17e-514e-4f52-a0b5-5bfb1adf84c9" },
  });

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedAsset(null), 300);
  };

  const assets = data?.getAssets || [];
  const netWorth = calculateNetWorth(assets);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Wealth Asset Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View and manage your wealth assets
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="medium">
            Error loading assets
          </Typography>
          <Typography variant="body2">{error.message}</Typography>
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            Please ensure the GraphQL server is running at
            http://localhost:4000/graphql
          </Typography>
        </Alert>
      )}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {!loading && !error && assets.length > 0 && (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: "#e3f2fd" }}>
            <Typography variant="h6" gutterBottom>
              Total Net Worth
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="primary">
              {formatCurrency(netWorth)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {assets.length} asset{assets.length !== 1 ? "s" : ""} included
            </Typography>
          </Paper>

          <AssetTable
            assets={assets}
            onAssetClick={handleAssetClick}
            loading={loading}
          />
        </>
      )}

      {!loading && !error && assets.length === 0 && (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No assets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check your GraphQL server connection
          </Typography>
        </Paper>
      )}

      <AssetModal
        asset={selectedAsset}
        open={modalOpen}
        onClose={handleModalClose}
        netWorth={netWorth}
      />
    </Container>
  );
}

export default App;
