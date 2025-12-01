"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Types matching the store interfaces (simplified for actions)
export interface ResourceData {
    type: string;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    donorId: string;
    location: string;
    priority: string;
    qualityCondition: string;
    expirationDate?: string;
    images?: string[];
    coordinates?: { lat: number; lng: number };
}

export interface NeedData {
    requesterId: string;
    resourceType: string;
    requiredQuantity: number;
    unit: string;
    urgency: string;
    description: string;
    location: string;
    specialRequirements?: string;
    beneficiaryCount?: number;
    vulnerabilityLevel?: string;
    coordinates?: { lat: number; lng: number };
}

export async function getResources() {
    try {
        const result = await turso.execute(`
      SELECT r.*, u.name as donor_name 
      FROM resources r 
      LEFT JOIN users u ON r.donor_id = u.id 
      ORDER BY r.created_at DESC
    `);

        return result.rows.map((row: any) => ({
            id: row.id,
            type: row.type,
            name: row.name,
            description: row.description,
            quantity: row.quantity,
            unit: row.unit,
            donorId: row.donor_id,
            donorName: row.donor_name || 'Anonymous',
            location: row.location,
            coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
            status: row.status,
            priority: row.priority,
            qualityCondition: row.quality_condition,
            expirationDate: row.expiration_date,
            images: row.images ? JSON.parse(row.images) : [],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    } catch (error) {
        console.error("Failed to fetch resources:", error);
        return [];
    }
}

export async function getNeeds() {
    try {
        const result = await turso.execute(`
      SELECT n.*, u.name as requester_name 
      FROM needs n 
      LEFT JOIN users u ON n.requester_id = u.id 
      ORDER BY n.created_at DESC
    `);

        return result.rows.map((row: any) => ({
            id: row.id,
            requesterId: row.requester_id,
            requesterName: row.requester_name || 'Anonymous',
            resourceType: row.resource_type,
            requiredQuantity: row.required_quantity,
            unit: row.unit,
            urgency: row.urgency,
            description: row.description,
            location: row.location,
            coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
            specialRequirements: row.special_requirements,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            beneficiaryCount: row.beneficiary_count,
            vulnerabilityLevel: row.vulnerability_level,
        }));
    } catch (error) {
        console.error("Failed to fetch needs:", error);
        return [];
    }
}

export async function createResource(data: ResourceData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "กรุณาเข้าสู่ระบบก่อนบริจาค" };
        }

        if (user.id !== data.donorId) {
            return { success: false, error: "ไม่สามารถบริจาคแทนผู้อื่นได้" };
        }

        const id = crypto.randomUUID();
        const coordinatesJson = data.coordinates ? JSON.stringify(data.coordinates) : null;

        await turso.execute({
            sql: `
        INSERT INTO resources (
          id, type, name, description, quantity, unit, donor_id, 
          location, coordinates, priority, quality_condition, expiration_date, images, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
            args: [
                id,
                data.type,
                data.name,
                data.description,
                data.quantity,
                data.unit,
                data.donorId,
                data.location,
                coordinatesJson,
                data.priority,
                data.qualityCondition,
                data.expirationDate || null,
                JSON.stringify(data.images || [])
            ]
        });
        revalidatePath('/resources');
        return { success: true, id };
    } catch (error) {
        console.error("Failed to create resource:", error);
        return { success: false, error };
    }
}

export async function createNeed(data: NeedData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "กรุณาเข้าสู่ระบบก่อนขอความช่วยเหลือ" };
        }

        if (user.id !== data.requesterId) {
            return { success: false, error: "ไม่สามารถขอความช่วยเหลือแทนผู้อื่นได้" };
        }

        const id = crypto.randomUUID();
        const coordinatesJson = data.coordinates ? JSON.stringify(data.coordinates) : null;

        await turso.execute({
            sql: `
        INSERT INTO needs (
          id, requester_id, resource_type, required_quantity, unit, 
          urgency, description, location, coordinates, special_requirements, beneficiary_count, vulnerability_level,
          status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
            args: [
                id,
                data.requesterId,
                data.resourceType,
                data.requiredQuantity,
                data.unit,
                data.urgency,
                data.description,
                data.location,
                coordinatesJson,
                data.specialRequirements || null,
                data.beneficiaryCount || 1,
                data.vulnerabilityLevel || 'medium'
            ]
        });
        revalidatePath('/resources');
        return { success: true, id };
    } catch (error) {
        console.error("Failed to create need:", error);
        return { success: false, error };
    }
}

export async function updateResourceStatus(id: string, status: string) {
    try {
        await turso.execute({
            sql: `UPDATE resources SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [status, id]
        });
        revalidatePath('/resources');
        return { success: true };
    } catch (error) {
        console.error("Failed to update resource status:", error);
        return { success: false, error };
    }
}

export async function updateNeedStatus(id: string, status: string) {
    try {
        await turso.execute({
            sql: `UPDATE needs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [status, id]
        });
        revalidatePath('/resources');
        return { success: true };
    } catch (error) {
        console.error("Failed to update need status:", error);
        return { success: false, error };
    }
}

export async function deleteResource(id: string) {
    try {
        await turso.execute({
            sql: "DELETE FROM resources WHERE id = ?",
            args: [id]
        });
        revalidatePath('/resources');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete resource:", error);
        return { success: false, error };
    }
}

export async function deleteNeed(id: string) {
    try {
        await turso.execute({
            sql: "DELETE FROM needs WHERE id = ?",
            args: [id]
        });
        revalidatePath('/resources');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete need:", error);
        return { success: false, error };
    }
}
