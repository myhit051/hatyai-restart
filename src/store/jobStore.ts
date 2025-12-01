import { create } from 'zustand';
import { getJobs, createJob, assignJob, updateJobStatus, deleteJob, type Job, type JobData, type JobStatus } from '@/app/actions/jobs';

export type { JobStatus } from '@/app/actions/jobs';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RepairType = 'electric' | 'plumbing' | 'structure' | 'cleaning' | 'other';

export interface RepairJob {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  coordinates: { lat: number; lng: number } | null;
  job_type: RepairType;
  urgency: UrgencyLevel;
  status: JobStatus;
  requesterId: string;
  requesterName?: string;
  assignedTo?: string | null;
  assignedTechnicianName?: string | null;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: RepairJob[];
  myJobs: RepairJob[];
  availableJobs: RepairJob[];
  isLoading: boolean;
  createJob: (jobData: JobData) => Promise<{ success: boolean; error?: string }>;
  assignJob: (jobId: string, technicianId: string) => Promise<void>;
  updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  deleteJob: (jobId: string) => Promise<{ success: boolean; error?: string }>;
  getJobsByLocation: (location: string) => RepairJob[];
  getJobsByTechnician: (technicianId: string) => RepairJob[];
  loadJobs: (userId?: string) => Promise<void>;
}

const mapJobToRepairJob = (job: Job): RepairJob => {
  let images: string[] = [];
  if (job.images) {
    try {
      images = JSON.parse(job.images);
    } catch (e) {
      images = [];
    }
  }

  let coordinates: { lat: number; lng: number } | null = null;
  if (job.coordinates) {
    try {
      coordinates = JSON.parse(job.coordinates);
    } catch (e) {
      coordinates = null;
    }
  }

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    coordinates,
    job_type: job.job_type as RepairType,
    urgency: job.urgency,
    status: job.status,
    requesterId: job.requester_id,
    requesterName: job.requester_name,
    assignedTo: job.technician_id,
    assignedTechnicianName: job.technician_name,
    images,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
};

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  myJobs: [],
  availableJobs: [],
  isLoading: false,

  loadJobs: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const jobsData = await getJobs();
      const jobs = jobsData.map(mapJobToRepairJob);

      const userJobs = userId
        ? jobs.filter(job => job.requesterId === userId || job.assignedTo === userId)
        : [];

      const available = userId
        ? jobs.filter(job => job.status === 'open' && job.requesterId !== userId)
        : jobs.filter(job => job.status === 'open');

      set({
        jobs,
        myJobs: userJobs,
        availableJobs: available,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
      set({ isLoading: false });
    }
  },

  createJob: async (jobData: JobData) => {
    const result = await createJob(jobData);
    if (result.success) {
      await get().loadJobs(jobData.requester_id);
    }
    return result;
  },

  assignJob: async (jobId: string, technicianId: string) => {
    const result = await assignJob(jobId, technicianId);
    if (result.success) {
      await get().loadJobs(technicianId);
    }
  },

  updateJobStatus: async (jobId: string, status: JobStatus) => {
    const result = await updateJobStatus(jobId, status);
    if (result.success) {
      await get().loadJobs();
    }
  },

  deleteJob: async (jobId: string) => {
    const result = await deleteJob(jobId);
    if (result.success) {
      // Optimistically update the state
      const { jobs, myJobs, availableJobs } = get();
      set({
        jobs: jobs.filter(j => j.id !== jobId),
        myJobs: myJobs.filter(j => j.id !== jobId),
        availableJobs: availableJobs.filter(j => j.id !== jobId),
      });
    }
    return result;
  },

  getJobsByLocation: (location: string) => {
    return get().jobs.filter(job =>
      job.location?.toLowerCase().includes(location.toLowerCase())
    );
  },

  getJobsByTechnician: (technicianId: string) => {
    return get().jobs.filter(job => job.assignedTo === technicianId);
  },
}));