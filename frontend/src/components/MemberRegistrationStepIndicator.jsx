import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MemberRegistrationStepIndicator = ({ steps, currentStep = 0 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
      {steps.map((label, index) => (
        <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: currentStep >= index ? '#342bdd' : '#e5e7eb',
              color: currentStep >= index ? '#FFFFFF' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
            component={motion.div}
            animate={{ scale: currentStep === index ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {index + 1}
          </Box>
          <Typography variant="caption" sx={{ color: currentStep >= index ? '#342bdd' : '#6b7280' }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MemberRegistrationStepIndicator;