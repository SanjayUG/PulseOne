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
import type { OperationTheatre, OTStatus } from '../types';

// Mock data
const initialOTs: OperationTheatre[] = [
  {
    id: '1',
    name: 'OT-1',
    status: 'available',
  },
  {
    id: '2',
    name: 'OT-2',
    status: 'occupied',
    currentSurgery: {
      patientId: 'P123',
      patientName: 'John Doe',
      startTime: '2024-03-20T10:00:00',
      estimatedEndTime: '2024-03-20T12:00:00',
    },
  },
  {
    id: '3',
    name: 'OT-3',
    status: 'maintenance',
  },
];

export default function OTManagement() {
  const [operationTheatres, setOperationTheatres] = useState<OperationTheatre[]>(initialOTs);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOT, setSelectedOT] = useState<OperationTheatre | null>(null);
  const [surgeryDetails, setSurgeryDetails] = useState({
    patientName: '',
    startTime: '',
    estimatedEndTime: '',
  });

  const handleOpenDialog = (ot: OperationTheatre) => {
    setSelectedOT(ot);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOT(null);
    setSurgeryDetails({
      patientName: '',
      startTime: '',
      estimatedEndTime: '',
    });
  };

  const handleScheduleSurgery = () => {
    if (!selectedOT) return;

    const updatedOTs = operationTheatres.map((ot) =>
      ot.id === selectedOT.id
        ? {
            ...ot,
            status: 'occupied',
            currentSurgery: {
              patientId: Math.random().toString(36).substr(2, 9),
              patientName: surgeryDetails.patientName,
              startTime: surgeryDetails.startTime,
              estimatedEndTime: surgeryDetails.estimatedEndTime,
            },
          }
        : ot
    );

    setOperationTheatres(updatedOTs);
    handleCloseDialog();
  };

  const getStatusColor = (status: OTStatus) => {
    switch (status) {
      case 'available':
        return '#059669';
      case 'occupied':
        return '#dc2626';
      case 'maintenance':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  const getStatusBgColor = (status: OTStatus) => {
    switch (status) {
      case 'available':
        return '#f0fdf4';
      case 'occupied':
        return '#fef2f2';
      case 'maintenance':
        return '#fffbeb';
      default:
        return '#f8fafc';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1e40af' }}>
        Operation Theatre Management
      </Typography>

      <Grid container spacing={3}>
        {operationTheatres.map((ot) => (
          <Grid item xs={12} md={4} key={ot.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)',
                },
                bgcolor: getStatusBgColor(ot.status),
              }}
            >
              <CardHeader
                title={ot.name}
                sx={{
                  '& .MuiCardHeader-title': {
                    color: '#1e40af',
                    fontWeight: 600,
                  },
                }}
                action={
                  ot.status === 'available' && (
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(ot)}
                    >
                      <AddIcon />
                    </IconButton>
                  )
                }
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={ot.status.toUpperCase()}
                    sx={{
                      bgcolor: getStatusColor(ot.status),
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                {ot.currentSurgery && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1e40af', mb: 1 }}>
                      Current Surgery:
                    </Typography>
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: '#1e40af', mb: 1 }}>
                        Patient: {ot.currentSurgery.patientName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        Start: {new Date(ot.currentSurgery.startTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Est. End: {new Date(ot.currentSurgery.estimatedEndTime).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: '#1e40af', fontWeight: 600 }}>
          Schedule Surgery
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Patient Name"
              value={surgeryDetails.patientName}
              onChange={(e) =>
                setSurgeryDetails({
                  ...surgeryDetails,
                  patientName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Start Time"
              type="datetime-local"
              value={surgeryDetails.startTime}
              onChange={(e) =>
                setSurgeryDetails({
                  ...surgeryDetails,
                  startTime: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Estimated End Time"
              type="datetime-local"
              value={surgeryDetails.estimatedEndTime}
              onChange={(e) =>
                setSurgeryDetails({
                  ...surgeryDetails,
                  estimatedEndTime: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSurgery}
            variant="contained"
            sx={{ bgcolor: '#1e40af' }}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 