import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    activePatients: 0,
    otStatus: 'No active operations',
    drugAlerts: [],
    emergencyAlerts: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [patientsRes, otRes, drugsRes, emergencyRes] = await Promise.allSettled([
          axios.get('http://localhost:5000/api/patients/active'),
          axios.get('http://localhost:5000/api/operation-theatre/status'),
          axios.get('http://localhost:5000/api/drugs/alerts'),
          axios.get('http://localhost:5000/api/emergency/active')
        ]);

        // Update dashboard data with successful responses
        setDashboardData(prev => ({
          activePatients: patientsRes.status === 'fulfilled' ? patientsRes.value.data.count : 0,
          otStatus: otRes.status === 'fulfilled' ? otRes.value.data.status : 'No active operations',
          drugAlerts: drugsRes.status === 'fulfilled' ? drugsRes.value.data : [],
          emergencyAlerts: emergencyRes.status === 'fulfilled' ? emergencyRes.value.data : []
        }));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Unable to fetch some dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Role: {user?.role}
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Active Patients */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Patients
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.activePatients}
            </Typography>
          </Paper>
        </Grid>

        {/* Operation Theatre Status */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              OT Status
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.otStatus}
            </Typography>
          </Paper>
        </Grid>

        {/* Drug Alerts */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Drug Alerts
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.drugAlerts.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Emergency Alerts */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Emergency Alerts
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.emergencyAlerts.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 