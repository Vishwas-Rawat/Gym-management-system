import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import AssignmentsCard from "../components/AssignmentsCard";
import { useGym } from "../context/GymContext";

const AdminAssignmentsPage = () => {
  const { gyms, getMyGyms } = useGym();
  const [selectedGymId, setSelectedGymId] = useState(18);

  useEffect(() => {
    getMyGyms();
  }, []);

  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      setSelectedGymId(gyms[0].gymId);
    }
  }, [gyms]);

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Trainer Assignments
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={selectedGymId || ""}
            onChange={(e) => setSelectedGymId(e.target.value)}
            displayEmpty
            size="small"
            sx={{
              bgcolor: 'white',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#007BFF',
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Gym
            </MenuItem>
            {gyms.map((gym) => (
              <MenuItem key={gym.gymId} value={gym.gymId}>
                {gym.gymName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedGymId && <AssignmentsCard gymId={selectedGymId} />}
    </Box>
  );
};

export default AdminAssignmentsPage;
