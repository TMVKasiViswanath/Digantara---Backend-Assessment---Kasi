import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api, { type CreateJobData } from '../services/api';

const jobTypes = [
  { value: 'email', label: 'Email Notification' },
  { value: 'calculation', label: 'Calculation' },
];

const scheduleTypes = [
  { value: 'interval', label: 'Interval' },
  { value: 'cron', label: 'Cron' },
  { value: 'date', label: 'Date' },
];

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateJobData>({
    name: '',
    description: '',
    job_type: 'email',
    schedule_type: 'interval',
    schedule_config: {
      seconds: 60,
    },
    parameters: {},
  });

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
    setLoading(true);

    try {
      await api.createJob(formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderScheduleConfigFields = () => {
    switch (formData.schedule_type) {
      case 'interval':
        return (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Interval (seconds)"
              type="number"
              value={formData.schedule_config.seconds || ''}
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
                value={formData.schedule_config.expression || ''}
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
              value={formData.schedule_config.run_date || ''}
              onChange={handleScheduleConfigChange('run_date')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 4 }} elevation={3}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/jobs')}
            sx={{ minWidth: 0 }}
          >
            Back to Jobs List
          </Button>
          <Typography variant="h5" fontWeight={700}>
            Create New Job
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Fill in the details below to schedule a new job.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Job Name"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="e.g., Daily Backup"
                helperText="A descriptive name for your job."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="e.g., Performs a full backup of the primary database."
                helperText="A short description of what this job does."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Schedule Type</InputLabel>
                <Select
                  value={formData.schedule_type}
                  label="Schedule Type"
                  onChange={(event) => setFormData({ ...formData, schedule_type: event.target.value as string })}
                >
                  {scheduleTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {renderScheduleConfigFields()}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.job_type}
                  label="Task Type"
                  onChange={(event) => setFormData({ ...formData, job_type: event.target.value as string })}
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Details"
                multiline
                rows={3}
                value={formData.parameters?.details || ''}
                onChange={e => setFormData({ ...formData, parameters: { ...formData.parameters, details: e.target.value } })}
                placeholder={"Enter task-specific configuration or script details. For Email, you might put: {to: 'test@example.com', subject: 'Hello'}. For Data Processing, a script path or parameters."}
                helperText={"Specific parameters or context for the job. For simple tasks, this could be a note. For complex ones, structured data (e.g., JSON)."}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/jobs')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Schedule Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateJob; 