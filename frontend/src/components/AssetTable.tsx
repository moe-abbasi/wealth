import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Collapse,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { Asset } from '../types';
import { formatCurrency, getAssetCategoryLabel, getAssetTypeLabel } from '../utils/formatters';

interface AssetTableProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
  loading?: boolean;
}

interface GroupedAssets {
  [category: string]: {
    [subcategory: string]: Asset[];
  };
}

const CategoryRow: React.FC<{
  category: string;
  subcategories: { [subcategory: string]: Asset[] };
  onAssetClick: (asset: Asset) => void;
}> = ({ category, subcategories, onAssetClick }) => {
  const [open, setOpen] = useState(true);

  const categoryTotal = useMemo(() => {
    return Object.values(subcategories).reduce((total, assets) => {
      return total + assets.reduce((sum, asset) => sum + asset.balanceCurrent, 0);
    }, 0);
  }, [subcategories]);

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: '#f5f5f5',
          '&:hover': { backgroundColor: '#eeeeee' },
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              {getAssetCategoryLabel(category)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell></TableCell>
        <TableCell align="right">
          <Typography variant="subtitle1" fontWeight="bold">
            {formatCurrency(categoryTotal)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 4 }}>
              {Object.entries(subcategories).map(([subcategory, assets]) => (
                <SubcategoryRow
                  key={subcategory}
                  subcategory={subcategory}
                  assets={assets}
                  onAssetClick={onAssetClick}
                />
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const SubcategoryRow: React.FC<{
  subcategory: string;
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
}> = ({ subcategory, assets, onAssetClick }) => {
  const [open, setOpen] = useState(true);

  const subcategoryTotal = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.balanceCurrent, 0);
  }, [assets]);

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: '#fafafa',
          '&:hover': { backgroundColor: '#f0f0f0' },
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
            <Typography variant="body1" fontWeight="medium">
              {getAssetTypeLabel(subcategory)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell></TableCell>
        <TableCell align="right">
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(subcategoryTotal)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 4 }}>
              {assets.map((asset) => (
                <TableRow
                  key={asset.assetId}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                  }}
                  onClick={() => onAssetClick(asset)}
                >
                  <TableCell sx={{ pl: 6 }}>
                    <Typography variant="body2">{asset.nickname}</Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatCurrency(asset.balanceCurrent)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const AssetTable: React.FC<AssetTableProps> = ({ assets, onAssetClick, loading }) => {
  const groupedAssets = useMemo(() => {
    const grouped: GroupedAssets = {};

    assets.forEach((asset) => {
      const category = asset.primaryAssetCategory;
      const subcategory = asset.wealthAssetType;

      if (!grouped[category]) {
        grouped[category] = {};
      }

      if (!grouped[category][subcategory]) {
        grouped[category][subcategory] = [];
      }

      grouped[category][subcategory].push(asset);
    });

    return grouped;
  }, [assets]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#1976d2' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Category / Subcategory / Asset
              </Typography>
            </TableCell>
            <TableCell sx={{ color: 'white' }}></TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Balance
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedAssets).map(([category, subcategories]) => (
            <CategoryRow
              key={category}
              category={category}
              subcategories={subcategories}
              onAssetClick={onAssetClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
