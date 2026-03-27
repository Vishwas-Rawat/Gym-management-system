import { createTheme } from '@mui/material';

const darkDashboardTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fb923c', // Orange accent
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4dabf7', // Blue
    },
    background: {
      default: '#0b0f19', // Very dark deep blue/black
      paper: '#151c2c',   // Slightly lighter navy for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8', // Muted slate
    },
    success: {
      main: '#51cf66',
    },
    warning: {
      main: '#fcc419',
    },
    error: {
      main: '#ef4444',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0b0f19',
          scrollbarColor: '#2d3748 #1a202c',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0b0f19',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#1e293b',
            borderRadius: '10px',
            '&:hover': {
              background: '#334155',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#151c2c',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#151c2c',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          '& .MuiTableCell-root': {
            color: '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
          boxShadow: '0 4px 14px 0 rgba(251, 146, 60, 0.39)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            boxShadow: '0 6px 20px rgba(251, 146, 60, 0.23)',
          },
        },
      },
    },
  },
});

export default darkDashboardTheme;
