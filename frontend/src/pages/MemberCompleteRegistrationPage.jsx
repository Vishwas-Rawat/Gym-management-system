import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Typography, Paper, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { ErrorOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';
import MemberCompleteRegistrationForm from '../components/MemberCompleteRegistrationForm';
import { MemberRegistrationProvider, useMemberRegistration } from '../context/MemberRegistrationContext';

const MemberCompleteRegistrationPageContent = () => {
  const [searchParams] = useSearchParams();
  const { setCompleteRegForm } = useMemberRegistration();
  const [missingToken, setMissingToken] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setCompleteRegForm((prev) => ({ ...prev, token }));
    } else {
      setMissingToken(true);
    }
  }, [searchParams, setCompleteRegForm]);

  if (missingToken) {
    return (
      <AuthLayout title="Registration Error" navText="Return to login" navLink="/login">
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 4,
            background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 32px var(--shadow-color)'
          }}
        >
          <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
            Invalid or Missing Registration Token
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Please check the link in your email and try again.
          </Typography>
        </Paper>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Complete Your Registration"
      navText="Finish setting up your gym membership account"
      navAction="Already have an account?"
      navLink="/login"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MemberCompleteRegistrationForm />
      </motion.div>
    </AuthLayout>
  );
};

const MemberCompleteRegistrationPage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <MemberRegistrationProvider>
        <MemberCompleteRegistrationPageContent />
      </MemberRegistrationProvider>
    </ThemeProvider>
  );
};

export default MemberCompleteRegistrationPage;