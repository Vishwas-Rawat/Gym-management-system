import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Alert
} from '@mui/material';
import { Person, Close, VerifiedUser } from '@mui/icons-material';
import { userApi } from '../services/api';

const AssignTrainerDialog = ({ open, onClose, gymId, memberId, onAssignSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    if (open && gymId) {
      fetchTrainers();
    }
  }, [open, gymId]);

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await userApi.get(`/trainer/gym/${gymId}`);
      setTrainers(data || []);
    } catch (err) {
      console.error("Failed to fetch trainers", err);
      setError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (trainerId) => {
    setAssigningId(trainerId);
    try {
      await userApi.post('/trainer/admin/assign-members', {
        trainerId,
        memberIds: [memberId]
      });
      if (onAssignSuccess) onAssignSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to assign trainer", err);
      alert("Failed to assign trainer: " + (err.response?.data?.message || err.message));
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Assign Trainer
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : trainers.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No trainers found in this gym.
          </Typography>
        ) : (
          <List>
            {trainers.map((trainer) => (
              <ListItem 
                key={trainer.trainerId}
                secondaryAction={
                    <Button 
                        variant="contained" 
                        size="small"
                        disabled={assigningId === trainer.trainerId}
                        onClick={() => handleAssign(trainer.trainerId)}
                    >
                        {assigningId === trainer.trainerId ? "Assigning..." : "Assign"}
                    </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {trainer.fullName ? trainer.fullName[0] : <Person />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={trainer.fullName || `Trainer #${trainer.trainerId}`}
                  secondary={trainer.specialization || "No specialization"}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignTrainerDialog;
