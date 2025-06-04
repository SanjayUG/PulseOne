import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Emergency() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: '',
    location: '',
    description: '',
    priority: 'high',
    severity: 'critical',
    patientId: '',
    assignedDoctor: '',
    status: 'active',
    timestamp: new Date().toISOString()
  });
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
    fetchPatients();
    fetchDoctors();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emergency');
      // Ensure we're setting an array, even if empty
      setAlerts(Array.isArray(response.data) ? response.data : 
                response.data.data ? response.data.data : 
                response.data.success ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
      setAlerts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleCreateAlert = async () => {
    try {
      if (!newAlert.type || !newAlert.location || !newAlert.description || !newAlert.patientId || !newAlert.assignedDoctor) {
        setError('Please fill in all required fields');
        return;
      }

      const severityMap = {
        high: 'critical',
        medium: 'severe',
        low: 'moderate'
      };

      const alertData = {
        ...newAlert,
        severity: severityMap[newAlert.priority] || 'critical',
        status: 'active',
        timestamp: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:5000/api/emergency', alertData);
      if (response.data.success) {
        setOpenDialog(false);
        setNewAlert({
          type: '',
          location: '',
          description: '',
          priority: 'high',
          severity: 'critical',
          patientId: '',
          assignedDoctor: '',
          status: 'active',
          timestamp: new Date().toISOString()
        });
        fetchData();
      } else {
        setError(response.data.message || 'Failed to create emergency alert');
      }
    } catch (error) {
      console.error('Error creating emergency alert:', error);
      setError(error.response?.data?.message || 'Failed to create emergency alert');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await axios.put(`http://localhost:5000/api/emergency/${alertId}/resolve`);
      fetchData();
    } catch (error) {
      console.error('Error resolving emergency alert:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Emergency Management</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Emergency Alert
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert._id}>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell>{alert.location}</TableCell>
                      <TableCell>{alert.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={alert.priority}
                          color={getPriorityColor(alert.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.status}
                          color={alert.status === 'active' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {alert.status === 'active' && (
                          <Tooltip title="Resolve Alert">
                            <IconButton
                              color="success"
                              onClick={() => handleResolveAlert(alert._id)}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setNewAlert({
            type: '',
            location: '',
            description: '',
            priority: 'high',
            severity: 'critical',
            patientId: '',
            assignedDoctor: '',
            status: 'active',
            timestamp: new Date().toISOString()
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Emergency Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Patient"
              value={newAlert.patientId || ''}
              onChange={(e) =>
                setNewAlert({ ...newAlert, patientId: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.name} - {patient.mrn}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Assigned Doctor"
              value={newAlert.assignedDoctor || ''}
              onChange={(e) =>
                setNewAlert({ ...newAlert, assignedDoctor: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Emergency Type"
              value={newAlert.type || ''}
              onChange={(e) =>
                setNewAlert({ ...newAlert, type: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            >
              <MenuItem value="trauma">Trauma</MenuItem>
              <MenuItem value="cardiac">Cardiac</MenuItem>
              <MenuItem value="respiratory">Respiratory</MenuItem>
              <MenuItem value="neurological">Neurological</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Location"
              value={newAlert.location || ''}
              onChange={(e) =>
                setNewAlert({ ...newAlert, location: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newAlert.description || ''}
              onChange={(e) =>
                setNewAlert({ ...newAlert, description: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              select
              fullWidth
              label="Priority"
              value={newAlert.priority || 'high'}
              onChange={(e) =>
                setNewAlert({ ...newAlert, priority: e.target.value })
              }
              required
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setNewAlert({
              type: '',
              location: '',
              description: '',
              priority: 'high',
              severity: 'critical',
              patientId: '',
              assignedDoctor: '',
              status: 'active',
              timestamp: new Date().toISOString()
            });
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateAlert} variant="contained" color="error">
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default Emergency; 