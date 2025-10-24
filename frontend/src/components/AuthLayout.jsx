import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({ title, children, navText, navAction, navLink }) => {
    const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            px: 4,
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '80%' }}>
            {navText}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4, md: 6 },
        }}
        component={motion.div}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ width: '100%', maxWidth: 500, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 4 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {navAction}{' '}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate(navLink)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {navLink === '/register' ? 'Sign Up' : 'Log In'}
            </Button>
          </Box>

          <Box display="flex" justifyContent="start" alignItems="center" mb={4}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;