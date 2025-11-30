"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export type WasteType = "organic" | "plastic" | "hazardous" | "construction" | "mixed";
export type WasteStatus = "reported" | "acknowledged" | "in_progress" | "cleared";
export type SeverityLevel = "low" | "medium" | "high";

export interface WasteReport {
    id: string;
    reporter_id: string;
    reporter_name?: string;
    waste_type: WasteType;
    description: string | null;
    location: string | null;
    coordinates: string | null; // JSON string {lat, lng}
    status: WasteStatus;
    severity: SeverityLevel;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface WasteReportData {
    reporter_id: string;
    reporter_name: string;
    waste_type: WasteType;
    description?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    severity?: SeverityLevel;
    image_url?: string;
}

export async function getWasteReports(): Promise<WasteReport[]> {
    try {
        const result = await turso.execute(`
      SELECT 
        w.*,
        u.name as reporter_name
      FROM waste_reports w
      LEFT JOIN users u ON w.reporter_id = u.id
      ORDER BY w.created_at DESC
    `);

        return result.rows.map((row: any) => ({
            id: row.id as string,
            reporter_id: row.reporter_id as string,
            reporter_name: row.reporter_name as string,
            waste_type: row.waste_type as WasteType,
            description: row.description as string | null,
            location: row.location as string | null,
            coordinates: row.coordinates as string | null,
            status: row.status as WasteStatus,
            severity: row.severity as SeverityLevel,
            image_url: row.image_url as string | null,
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
        }));
    } catch (error) {
        console.error("Error fetching waste reports:", error);
        return [];
    }
}

export async function createWasteReport(
    data: WasteReportData
): Promise<{ success: boolean; error?: string }> {
    try {
        const id = `waste_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const coordinatesJson = data.coordinates ? JSON.stringify(data.coordinates) : null;

        await turso.execute({
            sql: `
        INSERT INTO waste_reports (
          id, reporter_id, waste_type, description, location,
          coordinates, severity, image_url, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'reported')
      `,
            args: [
                id,
                data.reporter_id,
                data.waste_type,
                data.description || null,
                data.location || null,
                coordinatesJson,
                data.severity || "medium",
                data.image_url || null,
            ],
        });

        revalidatePath("/waste");
        return { success: true };
    } catch (error) {
        console.error("Error creating waste report:", error);
        return { success: false, error: "Failed to create waste report" };
    }
}

export async function updateWasteStatus(
    reportId: string,
    status: WasteStatus
): Promise<{ success: boolean; error?: string }> {
    try {
        await turso.execute({
            sql: `
        UPDATE waste_reports 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
            args: [status, reportId],
        });

        revalidatePath("/waste");
        return { success: true };
    } catch (error) {
        console.error("Error updating waste status:", error);
        return { success: false, error: "Failed to update waste status" };
    }
}
