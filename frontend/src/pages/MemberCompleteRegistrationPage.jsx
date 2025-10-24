import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';
import MemberCompleteRegistrationForm from '../components/MemberCompleteRegistrationForm';

const MemberCompleteRegistrationPage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
};

export default MemberCompleteRegistrationPage;