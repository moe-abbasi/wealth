import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { Asset, TabValue } from '../types';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  parseAssetInfo,
  getMajorClassLabel,
  getMinorClassLabel,
  getAssetTypeLabel,
} from '../utils/formatters';

interface AssetModalProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
  netWorth: number;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="medium">
      {value}
    </Typography>
  </Box>
);

const HoldingsRow: React.FC<{ majorClass: any; totalValue: number }> = ({ majorClass, totalValue }) => {
  const [open, setOpen] = useState(true);

  const majorClassTotal = useMemo(() => {
    return majorClass.assetClasses.reduce((sum: number, ac: any) => sum + ac.value, 0);
  }, [majorClass]);

  const majorClassPercentage = totalValue > 0 ? (majorClassTotal / totalValue) * 100 : 0;

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: '#f5f5f5',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#eeeeee' },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Typography variant="body2" fontWeight="medium">
              {getMajorClassLabel(majorClass.majorClass)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight="medium">
            {formatCurrency(majorClassTotal)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight="medium">
            {formatPercentage(majorClassPercentage)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, ml: 6 }}>
              {majorClass.assetClasses
                .filter((ac: any) => ac.value !== 0)
                .map((assetClass: any, index: number) => {
                  const percentage = totalValue > 0 ? (assetClass.value / totalValue) * 100 : 0;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {getMinorClassLabel(assetClass.minorAssetClass)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <Typography variant="body2" sx={{ minWidth: 100, textAlign: 'right' }}>
                          {formatCurrency(assetClass.value)}
                        </Typography>
                        <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                          {formatPercentage(percentage)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OverviewTab: React.FC<{ asset: Asset; netWorth: number }> = ({ asset, netWorth }) => {
  const assetInfo = parseAssetInfo(asset.assetInfo);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f9f9f9', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Current Value
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {formatCurrency(asset.balanceCurrent)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            As of {formatDate(asset.balanceAsOf)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f9f9f9', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Net Worth
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            {formatCurrency(netWorth)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Included in net worth
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoRow label="Asset Type" value={getAssetTypeLabel(asset.wealthAssetType)} />
        <InfoRow label="Nickname" value={asset.nickname} />
        {asset.balanceCostBasis > 0 && (
          <InfoRow label="Purchase Cost" value={formatCurrency(asset.balanceCostBasis)} />
        )}
        {assetInfo.purchaseDate && <InfoRow label="Purchase Date" value={formatDate(assetInfo.purchaseDate)} />}
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoRow label="Last Updated" value={formatDate(asset.lastUpdate)} />
        {asset.status && <InfoRow label="Status" value={asset.status} />}
        <InfoRow label="Institution ID" value={asset.institutionId} />
      </Grid>
    </Grid>
  );
};

const HoldingsTab: React.FC<{ asset: Asset }> = ({ asset }) => {
  if (!asset.holdings || !asset.holdings.majorAssetClasses) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No holdings data available for this asset.
        </Typography>
      </Box>
    );
  }

  const totalValue = useMemo(() => {
    return asset.holdings!.majorAssetClasses.reduce((total, majorClass) => {
      return (
        total + majorClass.assetClasses.reduce((sum, assetClass) => sum + assetClass.value, 0)
      );
    }, 0);
  }, [asset.holdings]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Asset Class
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight="bold">
                Value
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight="bold">
                % of Total
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {asset.holdings.majorAssetClasses.map((majorClass, index) => (
            <HoldingsRow key={index} majorClass={majorClass} totalValue={totalValue} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DetailsTab: React.FC<{ asset: Asset }> = ({ asset }) => {
  const assetInfo = parseAssetInfo(asset.assetInfo);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Asset Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoRow label="Asset ID" value={asset.assetId} />
        <InfoRow label="Asset Type" value={asset.assetInfoType} />
        <InfoRow label="Primary Category" value={asset.primaryAssetCategory} />
        <InfoRow label="Wealth Asset Type" value={asset.wealthAssetType} />
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoRow label="Created" value={formatDate(asset.creationDate)} />
        <InfoRow label="Modified" value={formatDate(asset.modificationDate)} />
        <InfoRow label="Is Active" value={asset.isActive ? 'Yes' : 'No'} />
        <InfoRow label="Is Favorite" value={asset.isFavorite ? 'Yes' : 'No'} />
      </Grid>

      {asset.wealthAssetType === 'RealEstate' && assetInfo.streetAddress && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Property Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <InfoRow label="Address" value={assetInfo.streetAddress} />
            {assetInfo.city && assetInfo.state && (
              <InfoRow label="Location" value={`${assetInfo.city}, ${assetInfo.state} ${assetInfo.zipCode || ''}`} />
            )}
            {assetInfo.neighborhood && <InfoRow label="Neighborhood" value={assetInfo.neighborhood} />}
          </Grid>
        </>
      )}

      {asset.wealthAssetType === 'Cryptocurrency' && assetInfo.cryptocurrencyName && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Cryptocurrency Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow label="Cryptocurrency" value={assetInfo.cryptocurrencyName} />
            {assetInfo.symbol && <InfoRow label="Symbol" value={assetInfo.symbol} />}
            {assetInfo.quantity && <InfoRow label="Quantity" value={assetInfo.quantity} />}
          </Grid>
          {asset.balancePrice && (
            <Grid item xs={12} md={6}>
              <InfoRow label="Price per Unit" value={formatCurrency(asset.balancePrice)} />
            </Grid>
          )}
        </>
      )}

      {asset.wealthAssetType === 'Vehicle' && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Vehicle Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            {assetInfo.modelYear && assetInfo.modelYear > 0 && (
              <InfoRow label="Model Year" value={assetInfo.modelYear} />
            )}
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Balance Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoRow label="Current Balance" value={formatCurrency(asset.balanceCurrent)} />
        <InfoRow label="Balance As Of" value={formatDate(asset.balanceAsOf)} />
        {asset.balanceCostBasis > 0 && <InfoRow label="Cost Basis" value={formatCurrency(asset.balanceCostBasis)} />}
      </Grid>

      <Grid item xs={12} md={6}>
        {asset.balanceQuantityCurrent && (
          <InfoRow label="Quantity" value={asset.balanceQuantityCurrent.toString()} />
        )}
        <InfoRow label="Include in Net Worth" value={asset.includeInNetWorth ? 'Yes' : 'No'} />
      </Grid>

      {asset.note && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{asset.note}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export const AssetModal: React.FC<AssetModalProps> = ({ asset, open, onClose, netWorth }) => {
  const [tabValue, setTabValue] = useState<TabValue>('overview');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setTabValue('overview');
    onClose();
  };

  if (!asset) return null;

  const hasHoldings = asset.holdings && asset.holdings.majorAssetClasses && asset.holdings.majorAssetClasses.length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {asset.nickname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {asset.primaryAssetCategory} · {getAssetTypeLabel(asset.wealthAssetType)}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" value="overview" />
          {hasHoldings && <Tab label="Holdings" value="holdings" />}
          <Tab label="Details" value="details" />
        </Tabs>
      </Box>
      <DialogContent sx={{ mt: 2 }}>
        {tabValue === 'overview' && <OverviewTab asset={asset} netWorth={netWorth} />}
        {tabValue === 'holdings' && <HoldingsTab asset={asset} />}
        {tabValue === 'details' && <DetailsTab asset={asset} />}
      </DialogContent>
    </Dialog>
  );
};
