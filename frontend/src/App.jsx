import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TokenManagement from './pages/TokenManagement';
import OperationTheatre from './pages/OperationTheatre';
import Pharmacy from './pages/Pharmacy';
import Emergency from './pages/Emergency';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="tokens" element={<TokenManagement />} />
                <Route path="operation-theatre" element={<OperationTheatre />} />
                <Route path="pharmacy" element={<Pharmacy />} />
                <Route path="emergency" element={<Emergency />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 