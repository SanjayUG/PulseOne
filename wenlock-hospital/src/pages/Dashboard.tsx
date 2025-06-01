import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as OTIcon,
  LocalPharmacy as PharmacyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock data
const stats = [
  {
    title: 'Total Patients',
    value: '156',
    icon: <PeopleIcon sx={{ fontSize: 40, color: '#00b4d8' }} />,
    color: '#f0fdf4',
    textColor: '#059669',
  },
  {
    title: 'Active OTs',
    value: '3/5',
    icon: <OTIcon sx={{ fontSize: 40, color: '#4361ee' }} />,
    color: '#f8fafc',
    textColor: '#1e40af',
  },
  {
    title: 'Low Stock Items',
    value: '8',
    icon: <PharmacyIcon sx={{ fontSize: 40, color: '#ffb703' }} />,
    color: '#fffbeb',
    textColor: '#d97706',
  },
  {
    title: 'Emergency Cases',
    value: '2',
    icon: <WarningIcon sx={{ fontSize: 40, color: '#ef476f' }} />,
    color: '#fef2f2',
    textColor: '#dc2626',
  },
];

const departments = [
  { name: 'Cardiology', patients: 45, capacity: 50 },
  { name: 'Orthopedics', patients: 30, capacity: 40 },
  { name: 'Neurology', patients: 25, capacity: 35 },
  { name: 'Pediatrics', patients: 40, capacity: 45 },
];

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
        Hospital Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                bgcolor: stat.color,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: stat.textColor, fontWeight: 500 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: stat.textColor, fontWeight: 600, mt: 1 }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: '#f8fafc' }}>
            <CardHeader
              title="Department Occupancy"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                '& .MuiCardHeader-title': {
                  color: '#1e40af',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              {departments.map((dept) => (
                <Box key={dept.name} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ color: '#1e40af' }}>
                      {dept.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {dept.patients}/{dept.capacity}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dept.patients / dept.capacity) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00b4d8',
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: '#f0fdf4' }}>
            <CardHeader
              title="Recent Activities"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                '& .MuiCardHeader-title': {
                  color: '#059669',
                  fontWeight: 600,
                },
              }}
            />
            <CardContent>
              {[
                'New patient admitted to Cardiology',
                'Surgery completed in OT-2',
                'Pharmacy stock updated',
                'Emergency case handled in ER',
              ].map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#00b4d8',
                      mr: 2,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#059669' }}>
                    {activity}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 