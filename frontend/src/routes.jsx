import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TokenManagement from './pages/TokenManagement';
import OperationTheatre from './pages/OperationTheatre';
import Pharmacy from './pages/Pharmacy';
import Emergency from './pages/Emergency';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
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
  );
}

export default AppRoutes; 