import { create } from 'zustand';

export type ResourceType = 'food' | 'water' | 'medicine' | 'shelter' | 'clothing' | 'tools' | 'construction' | 'other';
export type ResourceStatus = 'available' | 'assigned' | 'distributed' | 'expired';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  donorId: string;
  donorName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  status: ResourceStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  qualityCondition: 'excellent' | 'good' | 'fair' | 'poor';
  expirationDate?: string;
  storageRequirements?: string;
  distributionInstructions?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedRecipientName?: string;
  distributionDate?: string;
}

export interface ResourceNeed {
  id: string;
  requesterId: string;
  requesterName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  resourceType: ResourceType;
  requiredQuantity: number;
  unit: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  specialRequirements?: string;
  status: 'pending' | 'matched' | 'fulfilled';
  matchedResourceId?: string;
  matchedResourceName?: string;
  createdAt: string;
  updatedAt: string;
  beneficiaryCount?: number;
  vulnerabilityLevel: 'low' | 'medium' | 'high';
}

interface ResourceState {
  resources: Resource[];
  needs: ResourceNeed[];
  myDonations: Resource[];
  myNeeds: ResourceNeed[];
  availableResources: Resource[];
  pendingNeeds: ResourceNeed[];

  // Actions
  donateResource: (resourceData: Partial<Resource>) => Promise<void>;
  requestNeed: (needData: Partial<ResourceNeed>) => Promise<void>;
  matchResource: (resourceId: string, needId: string) => Promise<void>;
  updateResourceStatus: (resourceId: string, status: ResourceStatus) => Promise<void>;
  updateNeedStatus: (needId: string, status: ResourceNeed['status']) => Promise<void>;
  getResourcesByType: (type: ResourceType) => Resource[];
  getNeedsByUrgency: (urgency: string) => ResourceNeed[];
  findMatches: (needId: string) => Resource[];
  loadData: () => void;
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    type: 'food',
    name: 'น้ำดื่มขวดใหญ่',
    description: 'น้ำดื่มบรรจุขวดใหญ่ 20 ลิตร บริจาคจากบริษัท',
    quantity: 100,
    unit: 'ขวด',
    donorId: '7',
    donorName: 'บริษัท น้ำดื่มสะอาด จำกัด',
    location: 'หาดใหญ่ เขต 3',
    status: 'available',
    priority: 'high',
    qualityCondition: 'excellent',
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'shelter',
    name: 'เต็นท์พับได้',
    description: 'เต็นท์ขนาดครอบครัว 4-6 คน สำหรับผู้ประสบภัย',
    quantity: 20,
    unit: 'หลัง',
    donorId: '8',
    donorName: 'มูลนิธิช่วยผู้ประสบภัย',
    location: 'หาดใหญ่ ศาลากลางจังหวัด',
    status: 'assigned',
    priority: 'high',
    qualityCondition: 'good',
    assignedTo: 'need-1',
    assignedRecipientName: 'ชุมชนหาดใหญ่เหนือ',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    distributionDate: new Date().toISOString()
  }
];

const mockNeeds: ResourceNeed[] = [
  {
    id: '1',
    requesterId: '9',
    requesterName: 'นายสมศักดิ์ ผู้ประสบภัย',
    location: 'หาดใหญ่ เขต 4 หมู่บ้านสุขสันต์',
    resourceType: 'food',
    requiredQuantity: 50,
    unit: 'มื้ออาหาร',
    urgency: 'critical',
    description: 'ครอบครัวผู้สูงอายุและเด็ก 20 คน ต้องการอาหารด่วน',
    specialRequirements: 'อาหารที่อ่อนโยนต่อระบบย่อยอาหารของผู้สูงอายุ',
    status: 'matched',
    matchedResourceId: '1',
    matchedResourceName: 'น้ำดื่มขวดใหญ่',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    beneficiaryCount: 20,
    vulnerabilityLevel: 'high'
  },
  {
    id: '2',
    requesterId: '10',
    requesterName: 'กลุ่มช่วยเหลือชุมชนคลองสาย',
    location: 'หาดใหญ่ เขต 4 ริมคลองสาย',
    resourceType: 'medicine',
    requiredQuantity: 100,
    unit: 'ชุดยา',
    urgency: 'high',
    description: 'ยาปฏิชีวนะ ยาแก้ปวด และยาลดไข้',
    specialRequirements: 'ยาที่ไม่ต้องสั่งแพทย์ สำหรับฉุกเฉิน',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    beneficiaryCount: 50,
    vulnerabilityLevel: 'high'
  }
];

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: mockResources,
  needs: mockNeeds,
  myDonations: [],
  myNeeds: [],
  availableResources: [],
  pendingNeeds: [],

  donateResource: async (resourceData: Partial<Resource>) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newResource: Resource = {
      id: Date.now().toString(),
      type: resourceData.type || 'other',
      name: resourceData.name || '',
      description: resourceData.description || '',
      quantity: resourceData.quantity || 0,
      unit: resourceData.unit || 'ชิ้น',
      donorId: currentUser.id || '1',
      donorName: currentUser.name || 'ไม่ระบุชื่อ',
      location: resourceData.location || '',
      status: 'available',
      priority: resourceData.priority || 'medium',
      qualityCondition: resourceData.qualityCondition || 'good',
      expirationDate: resourceData.expirationDate,
      storageRequirements: resourceData.storageRequirements,
      distributionInstructions: resourceData.distributionInstructions,
      images: resourceData.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set(state => ({
      resources: [...state.resources, newResource],
      myDonations: currentUser.id ? [...state.myDonations, newResource] : state.myDonations,
      availableResources: [...state.availableResources, newResource]
    }));
  },

  requestNeed: async (needData: Partial<ResourceNeed>) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newNeed: ResourceNeed = {
      id: Date.now().toString(),
      requesterId: currentUser.id || '1',
      requesterName: currentUser.name || 'ไม่ระบุชื่อ',
      location: needData.location || '',
      resourceType: needData.resourceType || 'other',
      requiredQuantity: needData.requiredQuantity || 0,
      unit: needData.unit || 'ชิ้น',
      urgency: needData.urgency || 'medium',
      description: needData.description || '',
      specialRequirements: needData.specialRequirements,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      beneficiaryCount: needData.beneficiaryCount,
      vulnerabilityLevel: needData.vulnerabilityLevel || 'medium'
    };

    set(state => ({
      needs: [...state.needs, newNeed],
      myNeeds: currentUser.id ? [...state.myNeeds, newNeed] : state.myNeeds,
      pendingNeeds: [...state.pendingNeeds, newNeed]
    }));
  },

  matchResource: async (resourceId: string, needId: string) => {
    const resource = get().resources.find(r => r.id === resourceId);
    const need = get().needs.find(n => n.id === needId);

    if (resource && need) {
      set(state => ({
        resources: state.resources.map(r =>
          r.id === resourceId
            ? {
                ...r,
                status: 'assigned' as ResourceStatus,
                assignedTo: needId,
                assignedRecipientName: need.requesterName,
                updatedAt: new Date().toISOString()
              }
            : r
        ),
        needs: state.needs.map(n =>
          n.id === needId
            ? {
                ...n,
                status: 'matched' as ResourceNeed['status'],
                matchedResourceId: resourceId,
                matchedResourceName: resource.name,
                updatedAt: new Date().toISOString()
              }
            : n
        )
      }));
    }
  },

  updateResourceStatus: async (resourceId: string, status: ResourceStatus) => {
    set(state => ({
      resources: state.resources.map(resource =>
        resource.id === resourceId
          ? {
              ...resource,
              status,
              updatedAt: new Date().toISOString(),
              ...(status === 'distributed' ? { distributionDate: new Date().toISOString() } : {})
            }
          : resource
      )
    }));
  },

  updateNeedStatus: async (needId: string, status: ResourceNeed['status']) => {
    set(state => ({
      needs: state.needs.map(need =>
        need.id === needId
          ? {
              ...need,
              status,
              updatedAt: new Date().toISOString()
            }
          : need
      )
    }));
  },

  getResourcesByType: (type: ResourceType) => {
    return get().resources.filter(resource => resource.type === type && resource.status === 'available');
  },

  getNeedsByUrgency: (urgency: string) => {
    return get().needs.filter(need => need.urgency === urgency && need.status === 'pending');
  },

  findMatches: (needId: string) => {
    const need = get().needs.find(n => n.id === needId);
    if (!need) return [];

    return get().resources.filter(resource =>
      resource.type === need.resourceType &&
      resource.status === 'available' &&
      resource.quantity >= need.requiredQuantity &&
      resource.priority === need.urgency
    ).sort((a, b) => {
      // Sort by location proximity (mock implementation)
      if (a.location === need.location) return -1;
      if (b.location === need.location) return 1;
      return 0;
    });
  },

  loadData: () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const userDonations = get().resources.filter(resource => resource.donorId === currentUser.id);
    const userNeeds = get().needs.filter(need => need.requesterId === currentUser.id);
    const available = get().resources.filter(resource => resource.status === 'available');
    const pending = get().needs.filter(need => need.status === 'pending');

    set({
      myDonations: userDonations,
      myNeeds: userNeeds,
      availableResources: available,
      pendingNeeds: pending
    });
  }
}));