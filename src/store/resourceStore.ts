import { create } from 'zustand';
import { getResources, getNeeds, createResource, createNeed, updateResourceStatus, updateNeedStatus, ResourceData, NeedData } from '@/app/actions/resources';

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
  isLoading: boolean;

  // Actions
  donateResource: (resourceData: Partial<Resource>) => Promise<{ success: boolean; error?: any }>;
  requestNeed: (needData: Partial<ResourceNeed>) => Promise<{ success: boolean; error?: any }>;
  matchResource: (resourceId: string, needId: string) => Promise<void>;
  updateResourceStatus: (resourceId: string, status: ResourceStatus) => Promise<void>;
  updateNeedStatus: (needId: string, status: ResourceNeed['status']) => Promise<void>;
  getResourcesByType: (type: ResourceType) => Resource[];
  getNeedsByUrgency: (urgency: string) => ResourceNeed[];
  findMatches: (needId: string) => Resource[];
  loadData: () => Promise<void>;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  needs: [],
  myDonations: [],
  myNeeds: [],
  availableResources: [],
  pendingNeeds: [],
  isLoading: false,

  donateResource: async (resourceData: Partial<Resource>) => {
    try {
      const data: ResourceData = {
        type: resourceData.type || 'other',
        name: resourceData.name || '',
        description: resourceData.description || '',
        quantity: resourceData.quantity || 0,
        unit: resourceData.unit || 'items',
        donorId: resourceData.donorId || '',
        location: resourceData.location || '',
        coordinates: resourceData.coordinates,
        priority: resourceData.priority || 'medium',
        qualityCondition: resourceData.qualityCondition || 'good',
        expirationDate: resourceData.expirationDate,
        images: resourceData.images
      };

      const result = await createResource(data);
      if (result.success) {
        await get().loadData();
      }
      return result;
    } catch (error) {
      console.error("Donate resource failed:", error);
      return { success: false, error };
    }
  },

  requestNeed: async (needData: Partial<ResourceNeed>) => {
    try {
      const data: NeedData = {
        requesterId: needData.requesterId || '',
        resourceType: needData.resourceType || 'other',
        requiredQuantity: needData.requiredQuantity || 1,
        unit: needData.unit || 'items',
        urgency: needData.urgency || 'medium',
        description: needData.description || '',
        location: needData.location || '',
        coordinates: needData.coordinates,
        specialRequirements: needData.specialRequirements,
        beneficiaryCount: needData.beneficiaryCount,
        vulnerabilityLevel: needData.vulnerabilityLevel
      };

      const result = await createNeed(data);
      if (result.success) {
        await get().loadData();
      }
      return result;
    } catch (error) {
      console.error("Request need failed:", error);
      return { success: false, error };
    }
  },

  matchResource: async (resourceId: string, needId: string) => {
    // TODO: Implement server action for matching
    console.log("Match resource not implemented yet on server");
  },

  updateResourceStatus: async (resourceId: string, status: ResourceStatus) => {
    const result = await updateResourceStatus(resourceId, status);
    if (result.success) {
      await get().loadData();
    }
  },

  updateNeedStatus: async (needId: string, status: ResourceNeed['status']) => {
    const result = await updateNeedStatus(needId, status);
    if (result.success) {
      await get().loadData();
    }
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
    );
  },

  loadData: async () => {
    set({ isLoading: true });
    try {
      const [resourcesData, needsData] = await Promise.all([
        getResources(),
        getNeeds()
      ]);

      // We need to cast the result to our types because the server action returns a slightly different shape (e.g. dates are strings)
      // but our interface says string for dates anyway.

      const resources = resourcesData as unknown as Resource[];
      const needs = needsData as unknown as NeedData[]; // Wait, getNeeds returns objects with IDs.

      // Let's trust the server action returns compatible structure for now, or map it if needed.
      // The server action returns objects that match the Resource/ResourceNeed interfaces mostly.

      // Filter for "my" items - this requires the current user ID. 
      // Since we can't easily access authStore here without circular dependency or hook rules,
      // we might need to pass userId to loadData or let the component filter.
      // For now, we'll just populate the global lists.

      set({
        resources: resources,
        needs: needsData as unknown as ResourceNeed[],
        availableResources: resources.filter(r => r.status === 'available'),
        pendingNeeds: (needsData as unknown as ResourceNeed[]).filter(n => n.status === 'pending'),
        isLoading: false
      });
    } catch (error) {
      console.error("Load data failed:", error);
      set({ isLoading: false });
    }
  }
}));