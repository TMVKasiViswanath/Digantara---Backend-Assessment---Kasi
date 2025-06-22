import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format } from 'date-fns';
import api, { type Job } from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setError(null);
      const data = await api.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (error) {
        console.error('Error deleting job:', error);
        setError('Failed to delete job. Please try again.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'job_type', headerName: 'Type', width: 130 },
    { field: 'schedule_type', headerName: 'Schedule', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'completed'
              ? 'success'
              : params.value === 'failed'
              ? 'error'
              : params.value === 'running'
              ? 'primary'
              : 'default'
          }
          size="small"
        />
      ),
    },
    {
      field: 'next_run',
      headerName: 'Next Run',
      width: 180,
      valueFormatter: (params: { value: string }) =>
        params.value ? format(new Date(params.value), 'PPpp') : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={e => { e.stopPropagation(); navigate(`/jobs/${params.row.id}/edit`); }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => { e.stopPropagation(); handleDelete(params.row.id); }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Scheduled Jobs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage all your scheduled tasks.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          size="large"
          onClick={() => navigate('/jobs/create')}
        >
          Create New Job
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {jobs.length === 0 && !loading ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <WorkOutlineIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No jobs scheduled
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Get started by creating a new job.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            size="large"
            onClick={() => navigate('/jobs/create')}
          >
            Create New Job
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={jobs}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loading}
            onRowClick={(params) => navigate(`/jobs/${params.row.id}`)}
          />
        </Paper>
      )}
    </Box>
  );
};

export default JobList; 