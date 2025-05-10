import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Rooms from './pages/Rooms';
import CountSessions from './pages/CountSessions';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Define the MCL theme colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B181A', // Burgundy/Maroon from MCL
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#333333', // Dark Gray
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
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
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/count-sessions" element={<CountSessions />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;