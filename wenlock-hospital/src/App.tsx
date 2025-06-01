import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TokenManagement from './pages/TokenManagement';
import OTManagement from './pages/OTManagement';
import Pharmacy from './pages/Pharmacy';
import DisplayBoard from './pages/DisplayBoard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
      light: '#48cae4',
      dark: '#0096c7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4361ee',
      light: '#4895ef',
      dark: '#3f37c9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1b1e',
      paper: '#2d2e32',
    },
    info: {
      main: '#00b4d8',
      light: '#48cae4',
      dark: '#0096c7',
    },
    warning: {
      main: '#ffb703',
      light: '#ffd60a',
      dark: '#fb8500',
    },
    error: {
      main: '#ef476f',
      light: '#ff7096',
      dark: '#d90429',
    },
    success: {
      main: '#06d6a0',
      light: '#1b9aaa',
      dark: '#073b4c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      color: '#e2e8f0',
    },
    body2: {
      color: '#94a3b8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tokens" element={<TokenManagement />} />
            <Route path="/ot" element={<OTManagement />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/display" element={<DisplayBoard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
