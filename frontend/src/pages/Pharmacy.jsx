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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Pharmacy() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [newDrug, setNewDrug] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minimumStock: '',
    expiryDate: '',
    location: '',
    batchNumber: '',
    price: '',
    supplier: {
      name: '',
      contact: '',
      email: ''
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drugs');
      if (response.data.success && Array.isArray(response.data.data)) {
        setDrugs(response.data.data);
        setError(null);
      } else {
        setDrugs([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching drug data:', error);
      setError('Failed to fetch drug data');
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrug = async () => {
    try {
      // Convert string values to numbers where needed
      const drugData = {
        ...newDrug,
        quantity: Number(newDrug.quantity),
        minimumStock: Number(newDrug.minimumStock),
        price: Number(newDrug.price)
      };

      const response = await axios.post('http://localhost:5000/api/drugs', drugData);
      if (response.data.success) {
        setOpenDialog(false);
        setNewDrug({
          name: '',
          category: '',
          quantity: '',
          unit: '',
          minimumStock: '',
          expiryDate: '',
          location: '',
          batchNumber: '',
          price: '',
          supplier: {
            name: '',
            contact: '',
            email: ''
          }
        });
        fetchData();
      } else {
        setError(response.data.message || 'Failed to create drug');
      }
    } catch (error) {
      console.error('Error creating drug:', error);
      setError(error.response?.data?.message || 'Failed to create drug');
    }
  };

  const handleUpdateDrug = async () => {
    try {
      await axios.put(`http://localhost:5000/api/drugs/${editingDrug._id}`, editingDrug);
      setOpenDialog(false);
      setEditingDrug(null);
      fetchData();
    } catch (error) {
      console.error('Error updating drug:', error);
    }
  };

  const handleEditClick = (drug) => {
    setEditingDrug(drug);
    setOpenDialog(true);
  };

  const isLowStock = (quantity, minimumStock) => {
    return parseInt(quantity) <= parseInt(minimumStock);
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
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
        <Typography variant="h4">Pharmacy Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingDrug(null);
            setOpenDialog(true);
          }}
        >
          Add New Drug
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Drug Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Minimum Stock</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drugs.map((drug) => (
                    <TableRow key={drug._id}>
                      <TableCell>{drug.name}</TableCell>
                      <TableCell>{drug.category}</TableCell>
                      <TableCell>{drug.quantity}</TableCell>
                      <TableCell>{drug.unit}</TableCell>
                      <TableCell>{drug.minimumStock}</TableCell>
                      <TableCell>
                        {new Date(drug.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {isLowStock(drug.quantity, drug.minimumStock) && (
                            <Tooltip title="Low Stock">
                              <Chip
                                icon={<WarningIcon />}
                                label="Low Stock"
                                color="error"
                                size="small"
                              />
                            </Tooltip>
                          )}
                          {isExpiringSoon(drug.expiryDate) && (
                            <Tooltip title="Expiring Soon">
                              <Chip
                                icon={<WarningIcon />}
                                label="Expiring Soon"
                                color="warning"
                                size="small"
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(drug)}
                        >
                          <EditIcon />
                        </IconButton>
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
          setEditingDrug(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingDrug ? 'Edit Drug' : 'Add New Drug'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Drug Name"
              value={editingDrug ? editingDrug.name : newDrug.name}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, name: e.target.value })
                  : setNewDrug({ ...newDrug, name: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={editingDrug ? editingDrug.category : newDrug.category}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, category: e.target.value })
                  : setNewDrug({ ...newDrug, category: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={editingDrug ? editingDrug.quantity : newDrug.quantity}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, quantity: e.target.value })
                  : setNewDrug({ ...newDrug, quantity: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Unit"
              value={editingDrug ? editingDrug.unit : newDrug.unit}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, unit: e.target.value })
                  : setNewDrug({ ...newDrug, unit: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Minimum Stock"
              type="number"
              value={editingDrug ? editingDrug.minimumStock : newDrug.minimumStock}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, minimumStock: e.target.value })
                  : setNewDrug({ ...newDrug, minimumStock: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={editingDrug ? editingDrug.location : newDrug.location}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, location: e.target.value })
                  : setNewDrug({ ...newDrug, location: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Batch Number"
              value={editingDrug ? editingDrug.batchNumber : newDrug.batchNumber}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, batchNumber: e.target.value })
                  : setNewDrug({ ...newDrug, batchNumber: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={editingDrug ? editingDrug.price : newDrug.price}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, price: e.target.value })
                  : setNewDrug({ ...newDrug, price: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={editingDrug ? editingDrug.expiryDate : newDrug.expiryDate}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, expiryDate: e.target.value })
                  : setNewDrug({ ...newDrug, expiryDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              required
            />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Supplier Information</Typography>
            <TextField
              fullWidth
              label="Supplier Name"
              value={editingDrug ? editingDrug.supplier?.name : newDrug.supplier.name}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, supplier: { ...editingDrug.supplier, name: e.target.value } })
                  : setNewDrug({ ...newDrug, supplier: { ...newDrug.supplier, name: e.target.value } })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Supplier Contact"
              value={editingDrug ? editingDrug.supplier?.contact : newDrug.supplier.contact}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, supplier: { ...editingDrug.supplier, contact: e.target.value } })
                  : setNewDrug({ ...newDrug, supplier: { ...newDrug.supplier, contact: e.target.value } })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Supplier Email"
              type="email"
              value={editingDrug ? editingDrug.supplier?.email : newDrug.supplier.email}
              onChange={(e) =>
                editingDrug
                  ? setEditingDrug({ ...editingDrug, supplier: { ...editingDrug.supplier, email: e.target.value } })
                  : setNewDrug({ ...newDrug, supplier: { ...newDrug.supplier, email: e.target.value } })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingDrug(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingDrug ? handleUpdateDrug : handleCreateDrug}
            variant="contained"
          >
            {editingDrug ? 'Update' : 'Add'}
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

export default Pharmacy; 