import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import type { Patient, Department, OperationTheatre } from '../types';

// Mock data
const departments: Department[] = [
  { id: '1', name: 'Cardiology', currentToken: 15, waitingCount: 8, doctors: [] },
  { id: '2', name: 'Orthopedics', currentToken: 12, waitingCount: 5, doctors: [] },
  { id: '3', name: 'Neurology', currentToken: 8, waitingCount: 3, doctors: [] },
];

const operationTheatres: OperationTheatre[] = [
  {
    id: '1',
    name: 'OT-1',
    status: 'available',
  },
  {
    id: '2',
    name: 'OT-2',
    status: 'occupied',
    currentSurgery: {
      patientId: 'P123',
      patientName: 'John Doe',
      startTime: '2024-03-20T10:00:00',
      estimatedEndTime: '2024-03-20T12:00:00',
    },
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DisplayBoard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getWaitingStatusColor = (count: number) => {
    if (count <= 3) return '#059669';
    if (count <= 7) return '#d97706';
    return '#dc2626';
  };

  const getOTStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#059669';
      case 'occupied':
        return '#dc2626';
      case 'maintenance':
        return '#d97706';
      default:
        return '#64748b';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f9ff', minHeight: '100vh' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="display board tabs"
          sx={{
            '& .MuiTab-root': {
              color: '#1e40af',
              fontWeight: 500,
              '&.Mui-selected': {
                color: '#1e3a8a',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#1e3a8a',
            },
          }}
        >
          <Tab label="Token Display" />
          <Tab label="OT Status" />
        </Tabs>
      </Box>

      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: '#1e3a8a', fontWeight: 600 }}
        >
          Wenlock Hospital
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: '#1e40af', fontWeight: 500 }}
        >
          {currentTime.toLocaleString()}
        </Typography>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={4}>
          {departments.map((dept) => (
            <Grid item xs={12} md={4} key={dept.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  bgcolor: '#ffffff',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: '#1e3a8a', fontWeight: 600, textAlign: 'center' }}
                  >
                    {dept.name}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      color: '#1e40af',
                      fontWeight: 700,
                      textAlign: 'center',
                      my: 2,
                    }}
                  >
                    {dept.currentToken}
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: getWaitingStatusColor(dept.waitingCount),
                        fontWeight: 500,
                      }}
                    >
                      {dept.waitingCount} Patients Waiting
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={4}>
          {operationTheatres.map((ot) => (
            <Grid item xs={12} md={6} key={ot.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  bgcolor: '#ffffff',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: '#1e3a8a', fontWeight: 600, textAlign: 'center' }}
                  >
                    {ot.name}
                  </Typography>
                  <Box
                    sx={{
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: getOTStatusColor(ot.status),
                        fontWeight: 600,
                      }}
                    >
                      {ot.status.toUpperCase()}
                    </Typography>
                  </Box>
                  {ot.currentSurgery && (
                    <Box
                      sx={{
                        bgcolor: '#f8fafc',
                        p: 2,
                        borderRadius: 1,
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: '#1e40af', fontWeight: 500, mb: 1 }}
                      >
                        Current Surgery
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#1e40af', mb: 1 }}
                      >
                        Patient: {ot.currentSurgery.patientName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#64748b', mb: 1 }}
                      >
                        Start: {new Date(ot.currentSurgery.startTime).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#64748b' }}
                      >
                        Est. End: {new Date(ot.currentSurgery.estimatedEndTime).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
} 