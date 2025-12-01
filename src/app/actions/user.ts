"use server";

import { createClient } from "@/lib/supabase/server";
import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    try {
        // 1. Update Supabase User Metadata
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user.id === userId) {
            const { error: updateError } = await supabase.auth.updateUser({
                data: { role: role }
            });

            if (updateError) {
                console.error("Failed to update Supabase metadata:", updateError);
            }
        }

        // 2. Update Turso Database
        await turso.execute({
            sql: `UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [role, userId],
        });

        revalidatePath("/profile");
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update role" };
    }
}

export interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    phone?: string;
    created_at?: string;
}

export async function syncUser(user: UserData) {
    try {
        const result = await turso.execute({
            sql: "SELECT id FROM users WHERE id = ?",
            args: [user.id]
        });

        if (result.rows.length > 0) {
            await turso.execute({
                sql: `
                    UPDATE users 
                    SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `,
                args: [user.name, user.email, user.role, user.id]
            });
        } else {
            await turso.execute({
                sql: `
                    INSERT INTO users (id, name, email, role, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `,
                args: [user.id, user.name, user.email, user.role]
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error syncing user:", error);
        return { success: false, error: "Failed to sync user" };
    }
}

export async function getAllUsers() {
    try {
        const result = await turso.execute("SELECT * FROM users ORDER BY created_at DESC");
        return { success: true, users: result.rows as unknown as UserData[] };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users", users: [] };
    }
}

export async function getUser(userId: string) {
    try {
        const result = await turso.execute({
            sql: "SELECT * FROM users WHERE id = ?",
            args: [userId]
        });

        if (result.rows.length > 0) {
            return { success: true, user: result.rows[0] as unknown as UserData };
        }
        return { success: false, error: "User not found" };
    } catch (error) {
        console.error("Error fetching user:", error);
        return { success: false, error: "Failed to fetch user" };
    }
}

export async function deleteUser(userId: string) {
    try {
        // Note: This might fail if there are foreign key constraints.
        // Ideally we should soft delete or delete related records first.
        // For now, we'll try to delete directly.

        // Optional: Delete related jobs/reports if needed, or set them to null?
        // Let's just delete the user.
        await turso.execute({
            sql: "DELETE FROM users WHERE id = ?",
            args: [userId]
        });

        // Also try to delete from Supabase if possible (requires service role key usually)
        // Since we don't have service role key easily accessible here without setup, 
        // we'll just delete from our local DB which controls the app logic.

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function getUserHistory(userId: string) {
    try {
        // Fetch Jobs (Requester or Technician)
        const jobsResult = await turso.execute({
            sql: `
                SELECT id, title, status, created_at, 'job' as type 
                FROM jobs 
                WHERE requester_id = ? OR technician_id = ?
                ORDER BY created_at DESC
            `,
            args: [userId, userId]
        });

        // Fetch Waste Reports
        const wasteResult = await turso.execute({
            sql: `
                SELECT id, waste_type as title, status, created_at, 'waste' as type 
                FROM waste_reports 
                WHERE reporter_id = ?
                ORDER BY created_at DESC
            `,
            args: [userId]
        });

        const history = [
            ...jobsResult.rows.map(row => ({ ...row, title: `แจ้งซ่อม: ${row.title}` })),
            ...wasteResult.rows.map(row => ({ ...row, title: `รายงานขยะ: ${row.title}` }))
        ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return { success: true, history };
    } catch (error) {
        console.error("Error fetching user history:", error);
        return { success: false, error: "Failed to fetch user history", history: [] };
    }
}
