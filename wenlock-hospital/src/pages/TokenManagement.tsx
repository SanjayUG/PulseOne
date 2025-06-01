import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Department, Doctor } from '../types';

// Mock data
const initialDepartments: Department[] = [
  {
    id: '1',
    name: 'Cardiology',
    currentToken: 15,
    waitingCount: 8,
    doctors: [
      { id: '1', name: 'Dr. Smith', specialization: 'Cardiology' },
      { id: '2', name: 'Dr. Johnson', specialization: 'Cardiology' },
    ],
  },
  {
    id: '2',
    name: 'Orthopedics',
    currentToken: 12,
    waitingCount: 5,
    doctors: [
      { id: '3', name: 'Dr. Williams', specialization: 'Orthopedics' },
    ],
  },
  {
    id: '3',
    name: 'Neurology',
    currentToken: 8,
    waitingCount: 3,
    doctors: [
      { id: '4', name: 'Dr. Brown', specialization: 'Neurology' },
      { id: '5', name: 'Dr. Davis', specialization: 'Neurology' },
    ],
  },
];

export default function TokenManagement() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [tokenDetails, setTokenDetails] = useState({
    patientName: '',
    doctorId: '',
  });

  const handleOpenDialog = (department: Department) => {
    setSelectedDepartment(department);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDepartment(null);
    setTokenDetails({
      patientName: '',
      doctorId: '',
    });
  };

  const handleIssueToken = () => {
    if (!selectedDepartment) return;

    const updatedDepartments = departments.map((dept) =>
      dept.id === selectedDepartment.id
        ? {
            ...dept,
            currentToken: dept.currentToken + 1,
            waitingCount: dept.waitingCount + 1,
          }
        : dept
    );

    setDepartments(updatedDepartments);
    handleCloseDialog();
  };

  const getWaitingStatusColor = (count: number) => {
    if (count <= 3) return '#059669';
    if (count <= 7) return '#d97706';
    return '#dc2626';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1e40af' }}>
        Token Management
      </Typography>

      <Grid container spacing={3}>
        {departments.map((dept) => (
          <Grid item xs={12} md={4} key={dept.id}>
            <Card
              sx={{
                height: '100%',
                bgcolor: '#f8fafc',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)',
                },
              }}
            >
              <CardHeader
                title={dept.name}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  '& .MuiCardHeader-title': {
                    color: '#1e40af',
                    fontWeight: 600,
                  },
                }}
                action={
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(dept)}
                  >
                    <AddIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ color: '#1e40af', fontWeight: 600 }}>
                    {dept.currentToken}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Current Token
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`${dept.waitingCount} Patients Waiting`}
                    sx={{
                      bgcolor: getWaitingStatusColor(dept.waitingCount),
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ color: '#1e40af', mb: 1 }}>
                  Available Doctors:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dept.doctors.map((doctor) => (
                    <Chip
                      key={doctor.id}
                      label={doctor.name}
                      size="small"
                      sx={{
                        bgcolor: '#e2e8f0',
                        color: '#1e40af',
                        '&:hover': {
                          bgcolor: '#cbd5e1',
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: '#1e40af', fontWeight: 600 }}>
          Issue New Token
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Patient Name"
              value={tokenDetails.patientName}
              onChange={(e) =>
                setTokenDetails({
                  ...tokenDetails,
                  patientName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={tokenDetails.doctorId}
                label="Select Doctor"
                onChange={(e) =>
                  setTokenDetails({
                    ...tokenDetails,
                    doctorId: e.target.value,
                  })
                }
              >
                {selectedDepartment?.doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleIssueToken}
            variant="contained"
            sx={{ bgcolor: '#1e40af' }}
          >
            Issue Token
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 