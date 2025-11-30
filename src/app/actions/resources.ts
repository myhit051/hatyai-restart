"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

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
            specialRequirements: row.special_requirements, // Note: DB column might need check
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            beneficiaryCount: row.beneficiary_count, // Note: DB column might need check
            vulnerabilityLevel: row.vulnerability_level, // Note: DB column might need check
        }));
    } catch (error) {
        console.error("Failed to fetch needs:", error);
        return [];
    }
}

export async function createResource(data: ResourceData) {
    try {
        const id = crypto.randomUUID();
        await turso.execute({
            sql: `
        INSERT INTO resources (
          id, type, name, description, quantity, unit, donor_id, 
          location, priority, quality_condition, expiration_date, images, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
        const id = crypto.randomUUID();
        // Note: We need to make sure the columns exist in the schema we created.
        // Schema has: specialRequirements? No, schema has description. 
        // Let's check schema.sql content again mentally.
        // Schema: special_requirements is NOT in the CREATE TABLE statement I wrote earlier?
        // Wait, let me check the schema I wrote in Step 660.
        // Schema: 
        // CREATE TABLE IF NOT EXISTS needs (
        //   ...
        //   description TEXT,
        //   location TEXT,
        //   ...
        // );
        // It seems I missed `special_requirements`, `beneficiary_count`, `vulnerability_level` in the SQL I wrote in Step 660?
        // Let me quickly check the schema file content to be sure.

        await turso.execute({
            sql: `
        INSERT INTO needs (
          id, requester_id, resource_type, required_quantity, unit, 
          urgency, description, location, special_requirements, beneficiary_count, vulnerability_level,
          status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
