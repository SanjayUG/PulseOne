import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'receptionist', label: 'Receptionist' },
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Registration successful, redirect to login
        navigate('/login', { 
          replace: true,
          state: { message: 'Registration successful. Please login.' }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login', { replace: true });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Wenlock Hospital
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mt: 2 }}>
            Staff Registration
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={handleLoginClick}
              sx={{ textTransform: 'none' }}
            >
              Already have an account? Sign in
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register; 