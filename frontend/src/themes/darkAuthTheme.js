import { createTheme } from '@mui/material';

const darkAuthTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b6b', // Orange/Red accent
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a1a',
      paper: 'rgba(20, 20, 20, 0.8)', // Semi-transparent dark
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#ff4444',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0b0f14',
          backgroundImage: 'none', // Managed by layout
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff6b6b',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#ff6b6b',
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #ff6b6b 30%, #ff8e53 90%)',
          color: 'white',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export default darkAuthTheme;
