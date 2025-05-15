import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Rooms from './pages/Rooms';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Create a theme based on MCL Homemade colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B181A', // Burgundy/Maroon
    },
    secondary: {
      main: '#333333', // Dark Gray
    },
    background: {
      default: '#F5F5F5', // Light Gray
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#666666', // Medium Gray
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Georgia, serif',
    },
    h2: {
      fontFamily: 'Georgia, serif',
    },
    h3: {
      fontFamily: 'Georgia, serif',
    },
    h4: {
      fontFamily: 'Georgia, serif',
    },
    h5: {
      fontFamily: 'Georgia, serif',
    },
    h6: {
      fontFamily: 'Georgia, serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // This is a placeholder for actual authentication logic
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;