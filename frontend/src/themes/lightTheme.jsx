import { createTheme } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#f97316' },
    secondary: { main: '#4dabf7' },
    background: { default: '#f8fafc' },
    text: { primary: '#0f172a', secondary: '#334155' },
    success: { main: '#51cf66' },
    error: { main: '#ef4444' },
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
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: '#FFFFFF',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(249, 115, 22, 0.3)',
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          },
          '&:disabled': { background: 'grey', color: '#FFFFFF', opacity: 0.6 },
        },
      },
    },
  },
});

export default lightTheme;