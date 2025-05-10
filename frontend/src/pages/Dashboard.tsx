import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Room as RoomIcon,
  ListAlt as ListAltIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  route: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    rooms: 0,
    activeSessions: 0,
    completedSessions: 0,
    totalValue: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setStats({
            products: 124,
            rooms: 8,
            activeSessions: 2,
            completedSessions: 15,
            totalValue: 45678.90
          });
          
          setRecentActivities([
            {
              id: 1,
              type: 'count_session',
              description: 'Weekly inventory count completed',
              date: '2025-05-09T14:30:00Z'
            },
            {
              id: 2,
              type: 'product',
              description: 'Added 5 new products',
              date: '2025-05-08T10:15:00Z'
            },
            {
              id: 3,
              type: 'room',
              description: 'Updated Storage Room layout',
              date: '2025-05-07T16:45:00Z'
            },
            {
              id: 4,
              type: 'count_session',
              description: 'Monthly inventory count started',
              date: '2025-05-06T09:00:00Z'
            },
            {
              id: 5,
              type: 'report',
              description: 'Generated quarterly inventory report',
              date: '2025-05-05T11:20:00Z'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const statCards: StatCard[] = [
    {
      title: 'Products',
      value: stats.products,
      icon: <InventoryIcon fontSize="large" />,
      color: '#8B181A',
      route: '/products'
    },
    {
      title: 'Rooms',
      value: stats.rooms,
      icon: <RoomIcon fontSize="large" />,
      color: '#8B181A',
      route: '/rooms'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: <ListAltIcon fontSize="large" />,
      color: '#8B181A',
      route: '/count-sessions'
    },
    {
      title: 'Total Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: <AssessmentIcon fontSize="large" />,
      color: '#8B181A',
      route: '/reports'
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#8B181A' }} />
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Georgia, serif' }}>
        Welcome, {user?.username}!
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Here's an overview of your inventory management system
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(card.route)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>
                <Box sx={{ color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Recent Activity" 
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ 
                backgroundColor: 'rgba(139, 24, 26, 0.05)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={activity.description}
                        secondary={formatDate(activity.date)}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader 
              title="Quick Actions" 
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ 
                backgroundColor: 'rgba(139, 24, 26, 0.05)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      backgroundColor: '#8B181A',
                      '&:hover': {
                        backgroundColor: '#6a1214',
                      },
                    }}
                    onClick={() => navigate('/count-sessions/new')}
                  >
                    Start New Count
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#8B181A',
                      color: '#8B181A',
                      '&:hover': {
                        borderColor: '#6a1214',
                        backgroundColor: 'rgba(139, 24, 26, 0.05)',
                      },
                    }}
                    onClick={() => navigate('/reports/generate')}
                  >
                    Generate Report
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#8B181A',
                      color: '#8B181A',
                      '&:hover': {
                        borderColor: '#6a1214',
                        backgroundColor: 'rgba(139, 24, 26, 0.05)',
                      },
                    }}
                    onClick={() => navigate('/products/new')}
                  >
                    Add Product
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#8B181A',
                      color: '#8B181A',
                      '&:hover': {
                        borderColor: '#6a1214',
                        backgroundColor: 'rgba(139, 24, 26, 0.05)',
                      },
                    }}
                    onClick={() => navigate('/rooms/new')}
                  >
                    Add Room
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;