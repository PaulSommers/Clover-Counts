import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

// Mock data for rooms
const mockRooms = [
  {
    id: 1,
    name: 'Dry Storage',
    productCount: 45,
    totalValue: '$5,678.90',
    lastCounted: '2025-05-01',
  },
  {
    id: 2,
    name: 'Walk-in Cooler',
    productCount: 32,
    totalValue: '$8,234.56',
    lastCounted: '2025-05-01',
  },
  {
    id: 3,
    name: 'Walk-in Freezer',
    productCount: 28,
    totalValue: '$6,789.12',
    lastCounted: '2025-05-01',
  },
  {
    id: 4,
    name: 'Prep Area',
    productCount: 15,
    totalValue: '$1,234.56',
    lastCounted: '2025-05-01',
  },
  {
    id: 5,
    name: 'Bar',
    productCount: 36,
    totalValue: '$2,789.34',
    lastCounted: '2025-05-01',
  },
];

const Rooms = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Rooms</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Room
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardHeader
                title={room.name}
                action={
                  <Chip
                    label={`${room.productCount} Products`}
                    color="primary"
                    size="small"
                  />
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {room.totalValue}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Counted
                </Typography>
                <Typography variant="body1">
                  {room.lastCounted}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions disableSpacing>
                <Button
                  size="small"
                  startIcon={<InventoryIcon />}
                >
                  View Products
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Rooms;