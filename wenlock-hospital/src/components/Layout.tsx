import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ConfirmationNumber as TokenIcon,
  LocalHospital as OTIcon,
  LocalPharmacy as PharmacyIcon,
  Tv as DisplayIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Token Management', icon: <TokenIcon />, path: '/tokens' },
    { text: 'OT Management', icon: <OTIcon />, path: '/ot' },
    { text: 'Pharmacy', icon: <PharmacyIcon />, path: '/pharmacy' },
    { text: 'Display Board', icon: <DisplayIcon />, path: '/display' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#1a1b1e',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 2
      }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            color: '#00b4d8',
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
          }}
        >
          Pulse One +
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(0, 180, 216, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 180, 216, 0.15)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? '#00b4d8' : '#94a3b8',
                minWidth: 40,
                transition: 'color 0.2s',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  color: location.pathname === item.path ? '#ffffff' : '#94a3b8',
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    transition: 'all 0.2s',
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#1a1b1e' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#2d2e32',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              color: '#ffffff',
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#1a1b1e',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#1a1b1e',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          bgcolor: '#1a1b1e',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 