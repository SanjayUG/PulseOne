import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Drug } from '../types';

// Mock data
const initialDrugs: Drug[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    quantity: 1000,
    minimumQuantity: 200,
    lastUpdated: '2024-03-20T09:00:00',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    quantity: 500,
    minimumQuantity: 100,
    lastUpdated: '2024-03-20T10:00:00',
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    quantity: 150,
    minimumQuantity: 200,
    lastUpdated: '2024-03-20T11:00:00',
  },
];

export default function Pharmacy() {
  const [drugs, setDrugs] = useState<Drug[]>(initialDrugs);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [drugDetails, setDrugDetails] = useState({
    name: '',
    quantity: '',
    minimumQuantity: '',
  });

  const handleOpenDialog = (drug?: Drug) => {
    if (drug) {
      setSelectedDrug(drug);
      setDrugDetails({
        name: drug.name,
        quantity: drug.quantity.toString(),
        minimumQuantity: drug.minimumQuantity.toString(),
      });
    } else {
      setSelectedDrug(null);
      setDrugDetails({
        name: '',
        quantity: '',
        minimumQuantity: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDrug(null);
    setDrugDetails({
      name: '',
      quantity: '',
      minimumQuantity: '',
    });
  };

  const handleSaveDrug = () => {
    if (selectedDrug) {
      // Update existing drug
      const updatedDrugs = drugs.map((drug) =>
        drug.id === selectedDrug.id
          ? {
              ...drug,
              name: drugDetails.name,
              quantity: parseInt(drugDetails.quantity),
              minimumQuantity: parseInt(drugDetails.minimumQuantity),
              lastUpdated: new Date().toISOString(),
            }
          : drug
      );
      setDrugs(updatedDrugs);
    } else {
      // Add new drug
      const newDrug: Drug = {
        id: Math.random().toString(36).substr(2, 9),
        name: drugDetails.name,
        quantity: parseInt(drugDetails.quantity),
        minimumQuantity: parseInt(drugDetails.minimumQuantity),
        lastUpdated: new Date().toISOString(),
      };
      setDrugs([...drugs, newDrug]);
    }
    handleCloseDialog();
  };

  const getStockStatus = (quantity: number, minimumQuantity: number) => {
    if (quantity <= minimumQuantity) {
      return {
        label: 'Low Stock',
        color: '#dc2626',
        bgcolor: '#fef2f2',
      };
    }
    return {
      label: 'In Stock',
      color: '#059669',
      bgcolor: '#f0fdf4',
    };
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#1e40af' }}>
          Pharmacy Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#1e40af' }}
        >
          Add Drug
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#f8fafc' }}>
        <CardHeader
          title="Drug Inventory"
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            '& .MuiCardHeader-title': {
              color: '#1e40af',
              fontWeight: 600,
            },
          }}
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#1e40af', fontWeight: 600 }}>Drug Name</TableCell>
                  <TableCell align="right" sx={{ color: '#1e40af', fontWeight: 600 }}>Current Stock</TableCell>
                  <TableCell align="right" sx={{ color: '#1e40af', fontWeight: 600 }}>Minimum Required</TableCell>
                  <TableCell align="right" sx={{ color: '#1e40af', fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: '#1e40af', fontWeight: 600 }}>Last Updated</TableCell>
                  <TableCell align="right" sx={{ color: '#1e40af', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drugs.map((drug) => {
                  const status = getStockStatus(drug.quantity, drug.minimumQuantity);
                  return (
                    <TableRow
                      key={drug.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: '#1e40af' }}>{drug.name}</TableCell>
                      <TableCell align="right" sx={{ color: '#1e40af' }}>{drug.quantity}</TableCell>
                      <TableCell align="right" sx={{ color: '#1e40af' }}>{drug.minimumQuantity}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={status.label}
                          sx={{
                            color: status.color,
                            bgcolor: status.bgcolor,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#64748b' }}>
                        {new Date(drug.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(drug)}
                          sx={{ color: '#1e40af' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: '#1e40af', fontWeight: 600 }}>
          {selectedDrug ? 'Edit Drug' : 'Add New Drug'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Drug Name"
              value={drugDetails.name}
              onChange={(e) =>
                setDrugDetails({ ...drugDetails, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Current Stock"
              type="number"
              value={drugDetails.quantity}
              onChange={(e) =>
                setDrugDetails({ ...drugDetails, quantity: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Minimum Required"
              type="number"
              value={drugDetails.minimumQuantity}
              onChange={(e) =>
                setDrugDetails({
                  ...drugDetails,
                  minimumQuantity: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDrug}
            variant="contained"
            sx={{ bgcolor: '#1e40af' }}
          >
            {selectedDrug ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 