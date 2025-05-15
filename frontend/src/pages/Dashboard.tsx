import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const mockStats = {
    totalProducts: 156,
    totalRooms: 12,
    lastInventoryDate: '2025-05-01',
    totalValue: '$24,567.89',
    recentCounts: [
      { id: 1, date: '2025-05-01', status: 'Completed', value: '$24,567.89' },
      { id: 2, date: '2025-04-15', status: 'Completed', value: '$23,982.45' },
      { id: 3, date: '2025-04-01', status: 'Completed', value: '$24,102.33' },
    ],
    lowStockItems: [
      { id: 1, name: 'Flour', room: 'Dry Storage', quantity: '5 lbs' },
      { id: 2, name: 'Olive Oil', room: 'Dry Storage', quantity: '2 bottles' },
      { id: 3, name: 'Chicken Breast', room: 'Walk-in Cooler', quantity: '3 lbs' },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.username || 'User'}!
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h3">{mockStats.totalProducts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Rooms
            </Typography>
            <Typography variant="h3">{mockStats.totalRooms}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Last Inventory
            </Typography>
            <Typography variant="h5">{mockStats.lastInventoryDate}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h3">{mockStats.totalValue}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Counts and Low Stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Inventory Counts" />
            <Divider />
            <CardContent>
              <List>
                {mockStats.recentCounts.map((count) => (
                  <React.Fragment key={count.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${count.date} - ${count.value}`}
                        secondary={count.status}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Low Stock Items" />
            <Divider />
            <CardContent>
              <List>
                {mockStats.lowStockItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.room} - ${item.quantity}`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;