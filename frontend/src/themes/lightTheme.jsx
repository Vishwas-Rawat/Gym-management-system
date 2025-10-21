import { createTheme } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#342bddff' },
    secondary: { main: '#4F46E5' },
    background: { default: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)' },
    text: { primary: '#111827', secondary: '#4B5563' },
    success: { main: '#46e546ff' },
    error: { main: '#EF4444' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: { fontWeight: 700, letterSpacing: '0.3px' },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease',
            '&:hover fieldset': { borderColor: '#342bddff' },
            '&.Mui-focused fieldset': { borderColor: '#342bddff' },
          },
          '& .MuiInputLabel-root': {
            color: '#4B5563',
            '&.Mui-focused': { color: '#342bddff' },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
          padding: '12px 24px',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #4F46E5, #4F46E5)',
          color: '#FFFFFF',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(90deg, #342bddff, #342bddff)',
          },
          '&:disabled': { background: 'grey', color: '#FFFFFF', opacity: 0.6 },
        },
      },
    },
  },
});

export default lightTheme;