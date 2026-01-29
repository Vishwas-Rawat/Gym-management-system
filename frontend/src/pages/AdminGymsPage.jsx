import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add, Business, AccessTime, Phone, Email, LocationOn } from '@mui/icons-material';
import { useGym } from '../context/GymContext';
import { useNavigate } from 'react-router-dom';



const AdminGymsPage = () => {
  const { gyms, loading, error, getMyGyms, updateGym, deleteGym } = useGym();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [currentGym, setCurrentGym] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    getMyGyms();
  }, []);

  const handleEditClick = (gym) => {
    setCurrentGym(gym);
    setEditFormData({
      gymName: gym.gymName,
      contactNumber: gym.contactNumber,
      openingHours: gym.openingHours,
      // Add other fields if needed, but API doc says only send fields to update
    });
    setOpenEdit(true);
  };

  const handleDeleteClick = async (gymId) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      setActionLoading(true);
      const result = await deleteGym(gymId);
      setActionLoading(false);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentGym(null);
    setEditFormData({});
    setActionError('');
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setActionLoading(true);
    setActionError('');
    const result = await updateGym(currentGym.gymId, editFormData);
    setActionLoading(false);
    if (result.success) {
      handleEditClose();
    } else {
      setActionError(result.message);
    }
  };

  if (loading && gyms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            My Gyms
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/gym-register')}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Add New Gym
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {gyms.map((gym) => (
            <Grid item xs={12} md={6} lg={4} key={gym.gymId}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Business color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {gym.gymName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, color: 'text.secondary' }}>
                    <LocationOn fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
                    <Typography variant="body2">
                      {gym.address}, {gym.city}, {gym.state}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <Phone fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{gym.contactNumber}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                    <Email fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{gym.email}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <AccessTime fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{gym.openingHours}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <IconButton color="primary" onClick={() => handleEditClick(gym)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(gym.gymId)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>Update Gym Details</DialogTitle>
          <DialogContent>
            {actionError && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{actionError}</Alert>}
            <TextField
              margin="dense"
              label="Gym Name"
              name="gymName"
              fullWidth
              value={editFormData.gymName || ''}
              onChange={handleEditChange}
              variant="outlined"
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Contact Number"
              name="contactNumber"
              fullWidth
              value={editFormData.contactNumber || ''}
              onChange={handleEditChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Opening Hours"
              name="openingHours"
              fullWidth
              value={editFormData.openingHours || ''}
              onChange={handleEditChange}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleEditClose} color="inherit">Cancel</Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained" 
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default AdminGymsPage;
