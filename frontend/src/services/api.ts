import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Job {
  id: number;
  name: string;
  description: string | null;
  job_type: string;
  schedule_type: string;
  schedule_config: Record<string, any>;
  is_active: boolean;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
  updated_at: string;
  parameters: Record<string, any> | null;
  status: string;
  error_message: string | null;
}

export interface CreateJobData {
  name: string;
  description?: string;
  job_type: string;
  schedule_type: string;
  schedule_config: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface UpdateJobData {
  name?: string;
  description?: string;
  is_active?: boolean;
  schedule_config?: Record<string, any>;
  parameters?: Record<string, any>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleError = (error: AxiosError<{ detail: string }>) => {
  if (error.response) {
    throw new ApiError(
      error.response.status,
      error.response.data?.detail || 'An error occurred'
    );
  }
  throw new Error('Network error');
};

const api = {
  // Get all jobs
  getJobs: async (): Promise<Job[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError<{ detail: string }>);
    }
  },

  // Get a single job
  getJob: async (id: number): Promise<Job> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError<{ detail: string }>);
    }
  },

  // Create a new job
  createJob: async (jobData: CreateJobData): Promise<Job> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/jobs`, jobData);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError<{ detail: string }>);
    }
  },

  // Update a job
  updateJob: async (id: number, jobData: UpdateJobData): Promise<Job> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError<{ detail: string }>);
    }
  },

  // Delete a job
  deleteJob: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${id}`);
    } catch (error) {
      throw handleError(error as AxiosError<{ detail: string }>);
    }
  },
};


export default api; 