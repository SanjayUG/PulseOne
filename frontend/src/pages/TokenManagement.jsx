import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const departments = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dermatology',
  'Neurology',
  'Ophthalmology',
  'ENT',
  'Dental'
];

function TokenManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState({
    department: '',
    patientName: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/tokens');
      setTokens(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch tokens. Please try again later.');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewToken(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('http://localhost:5000/api/tokens', newToken);
      setTokens(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data]);
      setNewToken({
        department: '',
        patientName: '',
        priority: 'normal'
      });
    } catch (err) {
      console.error('Error creating token:', err);
      setError('Failed to create token. Please try again.');
    }
  };

  const handleStatusUpdate = async (tokenId, newStatus) => {
    try {
      setError('');
      await axios.patch(`http://localhost:5000/api/tokens/${tokenId}`, {
        status: newStatus
      });
      setTokens(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.map(token =>
          token._id === tokenId ? { ...token, status: newStatus } : token
        );
      });
    } catch (err) {
      console.error('Error updating token status:', err);
      setError('Failed to update token status. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const tokenList = Array.isArray(tokens) ? tokens : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Token Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Token Generation Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Generate New Token
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={newToken.department}
                onChange={handleInputChange}
                margin="normal"
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Patient Name"
                name="patientName"
                value={newToken.patientName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                label="Priority"
                name="priority"
                value={newToken.priority}
                onChange={handleInputChange}
                margin="normal"
                required
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </TextField>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Generate Token
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Active Tokens List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Tokens
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokenList.map((token) => (
                    <TableRow key={token._id}>
                      <TableCell>{token.tokenNumber}</TableCell>
                      <TableCell>{token.department}</TableCell>
                      <TableCell>{token.patientName}</TableCell>
                      <TableCell>{token.priority}</TableCell>
                      <TableCell>{token.status}</TableCell>
                      <TableCell>
                        {token.status === 'waiting' && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStatusUpdate(token._id, 'in-progress')}
                            sx={{ mr: 1 }}
                          >
                            Start
                          </Button>
                        )}
                        {token.status === 'in-progress' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleStatusUpdate(token._id, 'completed')}
                          >
                            Complete
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
    </Container>
  );
}

export default TokenManagement; 