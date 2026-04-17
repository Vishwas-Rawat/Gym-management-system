import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import gymBackground from '../assets/gym_background.png';
import gymLightBackground from '../assets/gym_light_background.png';

const AuthLayout = ({ title, children, navText, navAction, navLink, headline, subHeadline, navButtonText }) => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${isDarkMode ? gymBackground : gymLightBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.4)',
          transition: 'background 0.3s ease',
          zIndex: 1,
        },
      }}
    >
      {/* Theme Toggle */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
          background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          color: isDarkMode ? '#ff6b6b' : '#ff5252',
          '&:hover': {
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, px: { xs: 2, md: 4 }, py: { xs: 4, md: 0 } }}>
        <Grid container alignItems="center" justifyContent="center" spacing={4}>
          {/* Left Side: Branding Text - Stack on mobile, scale text */}
          <Grid item xs={12} md={6} lg={7} sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
            <Box component={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Typography variant="overline" sx={{ color: isDarkMode ? '#ff6b6b' : '#ff5252', fontWeight: 800, fontSize: { xs: '1rem', md: '1.2rem' }, letterSpacing: '2px', display: 'block', mb: 1 }}>
                | {subHeadline || 'ARE YOU READY TO'}
              </Typography>
              <Typography variant="h2" sx={{ color: isDarkMode ? 'white' : '#0f172a', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, mb: 2, fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' } }}>
                {headline ? (
                    <span dangerouslySetInnerHTML={{ __html: headline }} />
                ) : (
                    <>
                    <span style={{ color: isDarkMode ? '#ff6b6b' : '#ff5252' }}>GET FIT</span>, STRONG <br />
                    & MOTIVATED!
                    </>
                )}
              </Typography>
              <Typography variant="body1" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#334155', maxWidth: { xs: '100%', md: '500px' }, fontSize: { xs: '1rem', md: '1.35rem' }, fontWeight: 500, mb: 4, mx: { xs: 'auto', md: 0 } }}>
                {navText}
              </Typography>
            </Box>
          </Grid>

          {/* Right Side: Form Card */}
          <Grid item xs={12} md={6} lg={4}>
             <Box
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                background: isDarkMode ? 'rgba(20, 20, 20, 0.75)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                p: { xs: 3, sm: 5 },
                boxShadow: isDarkMode 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                  : '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: { xs: '100%', sm: '450px', md: '100%' },
                mx: 'auto'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: isDarkMode ? 'white' : '#0f172a' }}>
                  {title}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#64748b', display: 'block', fontWeight: 600, fontSize: '0.9rem' }}>
                        {navAction}
                    </Typography>
                    <Button 
                        onClick={() => navigate(navLink)} 
                        disableRipple
                        sx={{ 
                            p: 0, 
                            minWidth: 'auto', 
                            color: isDarkMode ? '#ff6b6b' : '#ff5252', 
                            fontWeight: 700,
                            fontSize: '1rem',
                            textTransform: 'none',
                            background: 'transparent',
                            '&:hover': { background: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        {navButtonText || (navLink === '/register' ? 'Sign Up' : 'Login')}
                    </Button>
                </Box>
              </Box>
              
              {children}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLayout;