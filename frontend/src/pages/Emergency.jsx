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
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emergency');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    try {
      await axios.post('http://localhost:5000/api/emergency', newAlert);
      setOpenDialog(false);
      setNewAlert({
        type: '',
        location: '',
        description: '',
        priority: 'high',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating emergency alert:', error);
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
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Emergency Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Emergency Type"
              value={newAlert.type}
              onChange={(e) =>
                setNewAlert({ ...newAlert, type: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              value={newAlert.location}
              onChange={(e) =>
                setNewAlert({ ...newAlert, location: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newAlert.description}
              onChange={(e) =>
                setNewAlert({ ...newAlert, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Priority"
              value={newAlert.priority}
              onChange={(e) =>
                setNewAlert({ ...newAlert, priority: e.target.value })
              }
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAlert} variant="contained" color="error">
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Emergency; 