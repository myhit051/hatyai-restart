"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export type JobStatus = "open" | "in_progress" | "completed" | "cancelled";
export type JobType = "electric" | "plumbing" | "structure" | "cleaning" | "other";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface Job {
    id: string;
    title: string;
    description: string | null;
    job_type: JobType;
    requester_id: string;
    requester_name?: string;
    technician_id: string | null;
    technician_name?: string | null;
    status: JobStatus;
    location: string | null;
    coordinates: string | null;
    urgency: UrgencyLevel;
    images: string | null;
    created_at: string;
    updated_at: string;
}

export interface JobData {
    title: string;
    description?: string;
    job_type: JobType;
    requester_id: string;
    requester_name: string;
    location?: string;
    urgency?: UrgencyLevel;
    images?: string[];
    coordinates?: { lat: number; lng: number };
}

export async function getJobs(): Promise<Job[]> {
    try {
        const result = await turso.execute(`
      SELECT 
        j.*,
        u1.name as requester_name,
        u2.name as technician_name
      FROM jobs j
      LEFT JOIN users u1 ON j.requester_id = u1.id
      LEFT JOIN users u2 ON j.technician_id = u2.id
      ORDER BY j.created_at DESC
    `);

        return result.rows.map((row: any) => ({
            id: row.id as string,
            title: row.title as string,
            description: row.description as string | null,
            job_type: row.job_type as JobType,
            requester_id: row.requester_id as string,
            requester_name: row.requester_name as string,
            technician_id: row.technician_id as string | null,
            technician_name: row.technician_name as string | null,
            status: row.status as JobStatus,
            location: row.location as string | null,
            coordinates: row.coordinates as string | null,
            urgency: row.urgency as UrgencyLevel,
            images: row.images as string | null,
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
        }));
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

export async function createJob(data: JobData): Promise<{ success: boolean; error?: string }> {
    try {
        const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const imagesJson = data.images && data.images.length > 0 ? JSON.stringify(data.images) : null;
        const coordinatesJson = data.coordinates ? JSON.stringify(data.coordinates) : null;

        await turso.execute({
            sql: `
        INSERT INTO jobs (
          id, title, description, job_type, requester_id,
          location, coordinates, urgency, images, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
      `,
            args: [
                id,
                data.title,
                data.description || null,
                data.job_type,
                data.requester_id,
                data.location || null,
                coordinatesJson,
                data.urgency || "medium",
                imagesJson,
            ],
        });

        revalidatePath("/repair");
        return { success: true };
    } catch (error) {
        console.error("Error creating job:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to create job" };
    }
}

export async function assignJob(
    jobId: string,
    technicianId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await turso.execute({
            sql: `
        UPDATE jobs 
        SET technician_id = ?, status = 'in_progress', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
            args: [technicianId, jobId],
        });

        revalidatePath("/repair");
        return { success: true };
    } catch (error) {
        console.error("Error assigning job:", error);
        return { success: false, error: "Failed to assign job" };
    }
}

export async function updateJobStatus(
    jobId: string,
    status: JobStatus
): Promise<{ success: boolean; error?: string }> {
    try {
        await turso.execute({
            sql: `
        UPDATE jobs 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
            args: [status, jobId],
        });

        revalidatePath("/repair");
        return { success: true };
    } catch (error) {
        console.error("Error updating job status:", error);
        return { success: false, error: "Failed to update job status" };
    }
}
