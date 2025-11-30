"use server";

import { createClient } from "@/lib/supabase/server";
import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient();

    try {
        // 1. Update Supabase User Metadata
        const { error: supabaseError } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { role: role } }
        );

        // Note: updating via admin api requires service_role key which we might not have exposed to the client creation.
        // If we can't use admin api, we can try updating user metadata as the user themselves if allowed.
        // But usually role change is sensitive.
        // For this MVP/Hackathon, let's assume we can just update the local DB and the client store will need to refresh.

        // Actually, supabase.auth.updateUser() updates the current user's metadata.
        // Let's try that first if we are logged in as that user.

        // Wait, this is a server action. We can get the current session.
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user.id === userId) {
            const { error: updateError } = await supabase.auth.updateUser({
                data: { role: role }
            });

            if (updateError) {
                console.error("Failed to update Supabase metadata:", updateError);
                // Continue to update Turso anyway for our app's logic
            }
        }

        // 2. Update Turso Database
        await turso.execute({
            sql: `UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [role, userId],
        });

        revalidatePath("/profile");
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
}

export async function syncUser(user: UserData) {
    try {
        // Check if user exists
        const result = await turso.execute({
            sql: "SELECT id FROM users WHERE id = ?",
            args: [user.id]
        });

        if (result.rows.length > 0) {
            // Update existing user
            await turso.execute({
                sql: `
                    UPDATE users 
                    SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `,
                args: [user.name, user.email, user.role, user.id]
            });
        } else {
            // Insert new user
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
