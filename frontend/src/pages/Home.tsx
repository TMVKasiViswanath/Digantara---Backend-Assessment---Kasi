import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 6, maxWidth: 700, width: '100%', textAlign: 'center', borderRadius: 4 }}>
        <InfoOutlinedIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome to TimeForge
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your reliable partner for scheduling and managing customized jobs with ease and flexibility.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          TimeForge allows you to define, schedule, and monitor tasks effortlessly. Get an overview of all your jobs, dive into specific details, and create new ones with custom configurations.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<WorkOutlineIcon />}
            onClick={() => navigate('/jobs')}
            sx={{ minWidth: 200 }}
          >
            View All Jobs
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FlashOnIcon />}
            onClick={() => navigate('/jobs/create')}
            sx={{ minWidth: 200 }}
          >
            Schedule a New Job
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Home; 