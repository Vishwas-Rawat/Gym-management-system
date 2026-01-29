import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../services/api';

const AssignMembersDialog = ({ open, onClose, trainer, onAssign }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (open && trainer?.gymId) {
      fetchMembers(trainer.gymId);
    }
  }, [open, trainer]);

  const fetchMembers = async (gymId) => {
    setLoading(true);
    try {
      // Assuming endpoint to get members by gym
      const { data } = await api.get(`/member/gym/${gymId}`);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch members", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (memberId) => {
    const currentIndex = selectedMemberIds.indexOf(memberId);
    const newChecked = [...selectedMemberIds];

    if (currentIndex === -1) {
      newChecked.push(memberId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedMemberIds(newChecked);
  };

  const handleAssign = async () => {
    setAssigning(true);
    await onAssign(trainer.trainerId || trainer.id, selectedMemberIds);
    setAssigning(false);
    onClose();
  };

  const filteredMembers = members.filter(m => 
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assign Members to {trainer?.fullName}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ height: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                 const memberId = member.memberId || member.id;
                 return (
                <ListItem
                  key={memberId}
                  button
                  onClick={() => handleToggle(memberId)}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedMemberIds.indexOf(memberId) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText 
                    primary={member.fullName} 
                    secondary={member.email} 
                  />
                </ListItem>
              )})
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
                No members found in this gym.
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleAssign} 
          variant="contained" 
          color="primary"
          disabled={assigning || selectedMemberIds.length === 0}
        >
          {assigning ? 'Assigning...' : `Assign (${selectedMemberIds.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignMembersDialog;
