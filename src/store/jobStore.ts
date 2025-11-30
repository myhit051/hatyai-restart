import { create } from 'zustand';

export type JobStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RepairType = 'electrical' | 'plumbing' | 'carpentry' | 'painting' | 'cleaning' | 'other';

export interface RepairJob {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  repairType: RepairType;
  urgencyLevel: UrgencyLevel;
  status: JobStatus;
  requesterId: string;
  requesterName: string;
  assignedTo?: string;
  assignedTechnicianName?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  estimatedDuration?: string;
  requiredSkills?: string[];
  notes?: string;
}

interface JobState {
  jobs: RepairJob[];
  myJobs: RepairJob[];
  availableJobs: RepairJob[];
  createJob: (jobData: Partial<RepairJob>) => Promise<void>;
  assignJob: (jobId: string, technicianId: string) => Promise<void>;
  updateJobStatus: (jobId: string, status: JobStatus, notes?: string) => Promise<void>;
  getJobsByLocation: (location: string) => RepairJob[];
  getJobsByTechnician: (technicianId: string) => RepairJob[];
  loadJobs: () => void;
}

// Mock data
const mockJobs: RepairJob[] = [
  {
    id: '1',
    title: 'ซ่อมปั๊มน้ำเสีย',
    description: 'ปั๊มน้ำในบ้านหมายเลข 123 เสีย ต้องการคนซ่อมด่วน',
    location: 'หาดใหญ่ เขต 1',
    coordinates: { lat: 7.0119, lng: 100.4758 },
    repairType: 'plumbing',
    urgencyLevel: 'high',
    status: 'pending',
    requesterId: '2',
    requesterName: 'นางสาวสมศรี มีสุข',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDuration: '2-3 ชั่วโมง',
    requiredSkills: ['ช่างปั๊ม', 'ช่างประปา'],
    notes: 'น้ำท่วมขังในบ้านสูงประมาณ 1 เมตร'
  },
  {
    id: '2',
    title: 'ซ่อมไฟระบบไฟฟ้า',
    description: 'ระบบไฟฟ้าในร้านดับ ต้องการคนตรวจสอบและซ่อมแซม',
    location: 'หาดใหญ่ เขต 2',
    coordinates: { lat: 7.0155, lng: 100.4738 },
    repairType: 'electrical',
    urgencyLevel: 'medium',
    status: 'assigned',
    requesterId: '3',
    requesterName: 'นายสมบูรณ์ รุ่งเรือง',
    assignedTo: '4',
    assignedTechnicianName: 'ช่างไฟ วิชัย ใจดี',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDuration: '3-4 ชั่วโมง',
    requiredSkills: ['ช่างไฟฟ้า', 'ช่างสนาม']
  }
];

export const useJobStore = create<JobState>((set, get) => ({
  jobs: mockJobs,
  myJobs: [],
  availableJobs: [],

  createJob: async (jobData: Partial<RepairJob>) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newJob: RepairJob = {
      id: Date.now().toString(),
      title: jobData.title || '',
      description: jobData.description || '',
      location: jobData.location || '',
      repairType: jobData.repairType || 'other',
      urgencyLevel: jobData.urgencyLevel || 'medium',
      status: 'pending',
      requesterId: currentUser.id || '1',
      requesterName: currentUser.name || 'ไม่ระบุชื่อ',
      images: jobData.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDuration: jobData.estimatedDuration,
      requiredSkills: jobData.requiredSkills,
      notes: jobData.notes
    };

    set(state => ({
      jobs: [...state.jobs, newJob],
      myJobs: currentUser.id ? [...state.myJobs, newJob] : state.myJobs
    }));
  },

  assignJob: async (jobId: string, technicianId: string) => {
    set(state => ({
      jobs: state.jobs.map(job =>
        job.id === jobId
          ? {
              ...job,
              status: 'assigned' as JobStatus,
              assignedTo: technicianId,
              updatedAt: new Date().toISOString()
            }
          : job
      )
    }));
  },

  updateJobStatus: async (jobId: string, status: JobStatus, notes?: string) => {
    set(state => ({
      jobs: state.jobs.map(job =>
        job.id === jobId
          ? {
              ...job,
              status,
              notes: notes ? job.notes + '\n' + notes : job.notes,
              updatedAt: new Date().toISOString()
            }
          : job
      )
    }));
  },

  getJobsByLocation: (location: string) => {
    return get().jobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  },

  getJobsByTechnician: (technicianId: string) => {
    return get().jobs.filter(job => job.assignedTo === technicianId);
  },

  loadJobs: () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const jobs = get().jobs;

    const userJobs = jobs.filter(job =>
      job.requesterId === currentUser.id || job.assignedTo === currentUser.id
    );

    const available = jobs.filter(job =>
      job.status === 'pending' && job.requesterId !== currentUser.id
    );

    set({
      myJobs: userJobs,
      availableJobs: available
    });
  }
}));