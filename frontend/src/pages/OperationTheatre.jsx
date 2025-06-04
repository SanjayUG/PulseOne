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
  MenuItem,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function OperationTheatre() {
  const { user } = useAuth();
  const [otSessions, setOtSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [newSession, setNewSession] = useState({
    patientName: '',
    procedure: '',
    surgeon: '',
    startTime: '',
    estimatedDuration: '',
    priority: 'normal',
  });

  const checkAndInitializeOT = async () => {
    try {
      // First try to get the OT
      const response = await axios.get('http://localhost:5000/api/operation-theatre');
      const ots = response.data.data;
      
      // Check if OT-1 exists
      const ot1 = ots.find(ot => ot.name === 'OT-1');
      
      if (!ot1) {
        console.log('OT-1 not found, initializing...');
        // Initialize OT-1
        await axios.post('http://localhost:5000/api/operation-theatre/initialize');
        console.log('OT-1 initialized successfully');
      } else {
        console.log('OT-1 found:', ot1);
      }
    } catch (error) {
      console.error('Error checking/initializing OT:', error);
      setSnackbar({
        open: true,
        message: 'Failed to initialize operation theatre',
        severity: 'error'
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/operation-theatre');
      if (response.data.success && Array.isArray(response.data.data)) {
        // Get the OT-1 data
        const ot1 = response.data.data.find(ot => ot.name === 'OT-1');
        if (ot1) {
          // Set the sessions from OT-1's schedule
          setOtSessions(ot1.schedule || []);
          console.log('Fetched OT sessions:', ot1.schedule);
        } else {
          setOtSessions([]);
        }
        setError(null);
      } else {
        setOtSessions([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching OT data:', error);
      setError('Failed to fetch operation theatre data');
      setOtSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkAndInitializeOT();
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleCreateSession = async () => {
    try {
      // Validate required fields
      if (!newSession.patientName || !newSession.procedure || !newSession.surgeon || 
          !newSession.startTime || !newSession.estimatedDuration) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      // Ensure OT is initialized
      await checkAndInitializeOT();

      // Create a surgery object first
      const surgeryData = {
        patientName: newSession.patientName,
        procedure: newSession.procedure,
        surgeon: newSession.surgeon,
        priority: newSession.priority,
        estimatedDuration: parseInt(newSession.estimatedDuration),
        startTime: new Date(newSession.startTime),
        status: 'scheduled'
      };

      console.log('Creating surgery with data:', surgeryData);

      // First create the surgery
      const surgeryResponse = await axios.post('http://localhost:5000/api/surgeries', surgeryData);
      
      if (!surgeryResponse.data.success) {
        throw new Error(surgeryResponse.data.message || 'Failed to create surgery record');
      }

      const surgeryId = surgeryResponse.data.data._id;
      console.log('Created surgery with ID:', surgeryId);
      
      // Calculate end time based on start time and duration
      const startTime = new Date(newSession.startTime);
      const endTime = new Date(startTime.getTime() + (newSession.estimatedDuration * 60000));

      console.log('Scheduling surgery with times:', { startTime, endTime });

      // Get the OT ID first
      const otResponse = await axios.get('http://localhost:5000/api/operation-theatre');
      const ots = otResponse.data.data;
      const ot1 = ots.find(ot => ot.name === 'OT-1');
      
      if (!ot1) {
        throw new Error('Operation theatre not found');
      }

      console.log('Found OT-1 with ID:', ot1._id);

      // Now schedule the surgery
      const scheduleResponse = await axios.post(`http://localhost:5000/api/operation-theatre/${ot1._id}/schedule`, {
        surgeryId: surgeryId,
        startTime: startTime,
        endTime: endTime
      });

      if (!scheduleResponse.data.success) {
        throw new Error(scheduleResponse.data.message || 'Failed to schedule surgery');
      }

      setSnackbar({
        open: true,
        message: 'Surgery scheduled successfully',
        severity: 'success'
      });

      setOpenDialog(false);
      setNewSession({
        patientName: '',
        procedure: '',
        surgeon: '',
        startTime: '',
        estimatedDuration: '',
        priority: 'normal',
      });
      fetchData();
    } catch (error) {
      console.error('Error creating OT session:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to create OT session',
        severity: 'error'
      });
    }
  };

  const handleStartSession = async (sessionId) => {
    try {
      await axios.patch(`http://localhost:5000/api/operation-theatre/1/status`, {
        status: 'active',
        sessionId: sessionId
      });
      fetchData();
    } catch (error) {
      console.error('Error starting OT session:', error);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await axios.patch(`http://localhost:5000/api/operation-theatre/1/status`, {
        status: 'completed',
        sessionId: sessionId
      });
      fetchData();
    } catch (error) {
      console.error('Error ending OT session:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Operation Theatre Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ScheduleIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Schedule New Session
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Procedure</TableCell>
                    <TableCell>Surgeon</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {otSessions && otSessions.length > 0 ? (
                    otSessions.map((session) => (
                      <TableRow key={session._id}>
                        <TableCell>{session.surgeryId?.patientName || 'N/A'}</TableCell>
                        <TableCell>{session.surgeryId?.procedure || 'N/A'}</TableCell>
                        <TableCell>{session.surgeryId?.surgeon || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(session.startTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{session.surgeryId?.estimatedDuration || 'N/A'} mins</TableCell>
                        <TableCell>
                          <Chip
                            label={session.surgeryId?.priority || 'normal'}
                            color={session.surgeryId?.priority === 'emergency' ? 'error' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={session.status}
                            color={getStatusColor(session.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {session.status === 'scheduled' && (
                            <Button
                              size="small"
                              color="success"
                              startIcon={<StartIcon />}
                              onClick={() => handleStartSession(session._id)}
                            >
                              Start
                            </Button>
                          )}
                          {session.status === 'active' && (
                            <Button
                              size="small"
                              color="error"
                              startIcon={<StopIcon />}
                              onClick={() => handleEndSession(session._id)}
                            >
                              End
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No operation theatre sessions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New OT Session</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Patient Name"
              value={newSession.patientName}
              onChange={(e) =>
                setNewSession({ ...newSession, patientName: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Procedure"
              value={newSession.procedure}
              onChange={(e) =>
                setNewSession({ ...newSession, procedure: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Surgeon"
              value={newSession.surgeon}
              onChange={(e) =>
                setNewSession({ ...newSession, surgeon: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={newSession.startTime}
              onChange={(e) =>
                setNewSession({ ...newSession, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Estimated Duration (minutes)"
              type="number"
              value={newSession.estimatedDuration}
              onChange={(e) =>
                setNewSession({ ...newSession, estimatedDuration: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Priority"
              value={newSession.priority}
              onChange={(e) =>
                setNewSession({ ...newSession, priority: e.target.value })
              }
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
              <MenuItem value="emergency">Emergency</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateSession} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OperationTheatre; 