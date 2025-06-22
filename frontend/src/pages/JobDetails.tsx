import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import api, { type Job } from '../services/api';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    if (!id) return;
    try {
      const data = await api.getJob(parseInt(id));
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!job) {
    return <Typography>Job not found</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {job.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/jobs/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography paragraph>{job.description || 'No description'}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Job Type
            </Typography>
            <Typography paragraph>{job.job_type}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Schedule Type
            </Typography>
            <Typography paragraph>{job.schedule_type}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={job.status}
              color={
                job.status === 'completed'
                  ? 'success'
                  : job.status === 'failed'
                  ? 'error'
                  : job.status === 'running'
                  ? 'primary'
                  : 'default'
              }
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Run
            </Typography>
            <Typography paragraph>
              {job.last_run
                ? format(new Date(job.last_run), 'PPpp')
                : 'Not run yet'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Next Run
            </Typography>
            <Typography paragraph>
              {job.next_run
                ? format(new Date(job.next_run), 'PPpp')
                : 'Not scheduled'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography paragraph>
              {format(new Date(job.created_at), 'PPpp')}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Updated At
            </Typography>
            <Typography paragraph>
              {format(new Date(job.updated_at), 'PPpp')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">
              Schedule Configuration
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(job.schedule_config, null, 2)}
              </pre>
            </Paper>
          </Grid>

          {job.parameters && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Parameters
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(job.parameters, null, 2)}
                </pre>
              </Paper>
            </Grid>
          )}

          {job.error_message && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="error">
                Error Message
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, mt: 1, bgcolor: 'error.light' }}
              >
                <Typography color="error">{job.error_message}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default JobDetails; 