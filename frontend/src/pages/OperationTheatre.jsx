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
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';

function OperationTheatre() {
  const [otSessions, setOtSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSession, setNewSession] = useState({
    patientName: '',
    procedure: '',
    surgeon: '',
    startTime: '',
    estimatedDuration: '',
    priority: 'normal',
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/operation-theatre/status');
      setOtSessions(response.data);
    } catch (error) {
      console.error('Error fetching OT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      await axios.post('http://localhost:5000/api/operation-theatre', newSession);
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
    }
  };

  const handleStartSession = async (sessionId) => {
    try {
      await axios.put(`http://localhost:5000/api/operation-theatre/${sessionId}/start`);
      fetchData();
    } catch (error) {
      console.error('Error starting OT session:', error);
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await axios.put(`http://localhost:5000/api/operation-theatre/${sessionId}/end`);
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
                  {otSessions.map((session) => (
                    <TableRow key={session._id}>
                      <TableCell>{session.patientName}</TableCell>
                      <TableCell>{session.procedure}</TableCell>
                      <TableCell>{session.surgeon}</TableCell>
                      <TableCell>
                        {new Date(session.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{session.estimatedDuration} mins</TableCell>
                      <TableCell>
                        <Chip
                          label={session.priority}
                          color={session.priority === 'emergency' ? 'error' : 'default'}
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
                  ))}
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
    </Box>
  );
}

export default OperationTheatre; 