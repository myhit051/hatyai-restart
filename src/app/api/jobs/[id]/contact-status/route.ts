import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you'd get current user ID from auth
    const userId = request.headers.get("x-user-id") || "demo_user_id";
    const jobId = params.id;

    const result = await turso.execute({
      sql: 'SELECT id FROM job_contacts WHERE job_id = ? AND user_id = ?',
      args: [jobId, userId],
    });

    const hasViewed = result.rows.length > 0;

    return NextResponse.json({ hasViewed });
  } catch (error) {
    console.error("Error checking contact status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In a real app, you'd get current user ID from auth
    const userId = request.headers.get("x-user-id") || "demo_user_id";
    const jobId = params.id;

    const existingContact = await turso.execute({
      sql: 'SELECT id FROM job_contacts WHERE job_id = ? AND user_id = ?',
      args: [jobId, userId],
    });

    if (existingContact.rows.length === 0) {
      // First time accessing
      const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await turso.execute({
        sql: 'INSERT INTO job_contacts (id, job_id, user_id, contact_shown) VALUES (?, ?, ?, TRUE)',
        args: [contactId, jobId, userId],
      });

      // Increment contact count on job
      await turso.execute({
        sql: 'UPDATE jobs SET contact_count = contact_count + 1 WHERE id = ?',
        args: [jobId],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error showing contact:", error);
    return NextResponse.json(
      { error: "Failed to show contact" },
      { status: 500 }
    );
  }
}