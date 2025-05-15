import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Mock data for products
const mockProducts = [
  { id: 1, name: 'Flour', unit: 'lb', value: 0.45, category: 'Dry Goods' },
  { id: 2, name: 'Sugar', unit: 'lb', value: 0.65, category: 'Dry Goods' },
  { id: 3, name: 'Olive Oil', unit: 'bottle', value: 12.99, category: 'Oils' },
  { id: 4, name: 'Chicken Breast', unit: 'lb', value: 3.99, category: 'Meat' },
  { id: 5, name: 'Tomatoes', unit: 'lb', value: 2.49, category: 'Produce' },
  { id: 6, name: 'Milk', unit: 'gallon', value: 3.79, category: 'Dairy' },
  { id: 7, name: 'Eggs', unit: 'dozen', value: 4.29, category: 'Dairy' },
  { id: 8, name: 'Salt', unit: 'lb', value: 0.89, category: 'Dry Goods' },
];

const Products = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>${product.value.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;