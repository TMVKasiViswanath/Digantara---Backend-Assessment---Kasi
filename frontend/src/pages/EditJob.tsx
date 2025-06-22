import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api, { type Job, type UpdateJobData } from '../services/api';

const jobTypes = [
  { value: 'email', label: 'Email Notification' },
  { value: 'calculation', label: 'Calculation' },
];

const scheduleTypes = [
  { value: 'interval', label: 'Interval' },
  { value: 'cron', label: 'Cron' },
  { value: 'date', label: 'Date' },
];

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<UpdateJobData>({
    name: '',
    description: '',
    is_active: true,
    schedule_config: {},
    parameters: {},
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;
    try {
      const data = await api.getJob(parseInt(id));
      setJob(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        is_active: data.is_active,
        schedule_config: data.schedule_config,
        parameters: data.parameters || {},
      });
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleScheduleConfigChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      schedule_config: {
        ...formData.schedule_config,
        [field]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      await api.updateJob(parseInt(id), formData);
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderScheduleConfigFields = () => {
    if (!job) return null;

    switch (job.schedule_type) {
      case 'interval':
        return (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Interval (seconds)"
              type="number"
              value={formData.schedule_config?.seconds || ''}
              onChange={handleScheduleConfigChange('seconds')}
            />
          </Grid>
        );
      case 'cron':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cron Expression"
                value={formData.schedule_config?.expression || ''}
                onChange={handleScheduleConfigChange('expression')}
                placeholder="* * * * *"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                Format: minute hour day month weekday
              </Typography>
            </Grid>
          </>
        );
      case 'date':
        return (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Run Date"
              type="datetime-local"
              value={formData.schedule_config?.run_date || ''}
              onChange={handleScheduleConfigChange('run_date')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        );
      default:
        return null;
    }
  };

  if (!job) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/jobs/${id}`)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">Edit Job</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Job Name"
                value={formData.name}
                onChange={handleChange('name')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>

            {renderScheduleConfigFields()}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/jobs/${id}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditJob; 