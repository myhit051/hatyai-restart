"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export type JobStatus = "open" | "in_progress" | "completed" | "cancelled";
export type JobType = "repair" | "general";
export type PostingType = "hiring" | "seeking";
export type WorkLocationType = "onsite" | "remote" | "hybrid";
export type WageType = "daily" | "hourly" | "per_project" | "negotiable";
export type UrgencyLevel = "low" | "medium" | "high" | "urgent";

export interface JobCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GeneralJob {
  id: string;
  title: string;
  description: string | null;
  job_type: JobType;
  category_id: string | null;
  subcategory: string | null;
  posting_type: PostingType;
  employer_id: string | null;
  seeker_id: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  location: string | null;
  coordinates: string | null;
  work_location_type: WorkLocationType;
  wage_type: string | null;
  wage_amount: number | null;
  wage_currency: string;
  work_duration: string | null;
  skills_required: string | null;
  requirements: string | null;
  status: JobStatus;
  urgency: UrgencyLevel;
  images: string | null;
  view_count: number;
  contact_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  employer_name?: string;
  seeker_name?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  message: string | null;
  status: "applied" | "viewed" | "contacted" | "rejected" | "accepted";
  created_at: string;
  updated_at: string;
  applicant_name?: string;
}

export interface JobData {
  title: string;
  description?: string;
  job_type: JobType;
  category_id?: string;
  subcategory?: string;
  posting_type: PostingType;
  employer_id?: string;
  seeker_id?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  work_location_type?: WorkLocationType;
  wage_type?: WageType;
  wage_amount?: number;
  wage_currency?: string;
  work_duration?: string;
  skills_required?: string[];
  requirements?: string;
  urgency?: UrgencyLevel;
  images?: string[];
  expires_at?: string;
}

// Job Categories
export async function getJobCategories(): Promise<JobCategory[]> {
  try {
    const result = await turso.execute(`
      SELECT * FROM job_categories
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `);

    return result.rows.map((row: any) => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      icon: row.icon as string | null,
      is_active: Boolean(row.is_active),
      sort_order: row.sort_order as number,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }));
  } catch (error) {
    console.error("Error fetching job categories:", error);
    return [];
  }
}

export async function createJobCategory(
  name: string,
  description?: string,
  icon?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await turso.execute({
      sql: `
        INSERT INTO job_categories (id, name, description, icon, sort_order)
        VALUES (?, ?, ?, ?,
          (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM job_categories WHERE is_active = TRUE)
        )
      `,
      args: [id, name, description || null, icon || null],
    });

    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    console.error("Error creating job category:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create job category" };
  }
}

// General Jobs
export async function getGeneralJobs(
  filters?: {
    posting_type?: PostingType;
    category_id?: string;
    job_type?: JobType;
    urgency?: UrgencyLevel;
    location?: string;
    search?: string;
  },
  limit = 50
): Promise<GeneralJob[]> {
  try {
    let whereClause = "WHERE 1=1";
    const args: any[] = [];

    if (filters) {
      if (filters.posting_type) {
        whereClause += " AND j.posting_type = ?";
        args.push(filters.posting_type);
      }
      if (filters.category_id) {
        whereClause += " AND j.category_id = ?";
        args.push(filters.category_id);
      }
      if (filters.job_type) {
        whereClause += " AND j.job_type = ?";
        args.push(filters.job_type);
      }
      if (filters.urgency) {
        whereClause += " AND j.urgency = ?";
        args.push(filters.urgency);
      }
      if (filters.search) {
        whereClause += " AND (j.title LIKE ? OR j.description LIKE ?)";
        args.push(`%${filters.search}%`, `%${filters.search}%`);
      }
    }

    const result = await turso.execute(`
      SELECT
        j.*,
        jc.name as category_name,
        u1.name as employer_name,
        u2.name as seeker_name
      FROM jobs j
      LEFT JOIN job_categories jc ON j.category_id = jc.id
      LEFT JOIN users u1 ON j.employer_id = u1.id
      LEFT JOIN users u2 ON j.seeker_id = u2.id
      ${whereClause}
      ORDER BY j.created_at DESC
      LIMIT ?
    `, [...args, limit]);

    return result.rows.map((row: any) => ({
      id: row.id as string,
      title: row.title as string,
      description: row.description as string | null,
      job_type: row.job_type as JobType,
      category_id: row.category_id as string | null,
      subcategory: row.subcategory as string | null,
      posting_type: row.posting_type as PostingType,
      employer_id: row.employer_id as string | null,
      seeker_id: row.seeker_id as string | null,
      contact_person: row.contact_person as string | null,
      contact_phone: row.contact_phone as string | null,
      contact_email: row.contact_email as string | null,
      location: row.location as string | null,
      coordinates: row.coordinates as string | null,
      work_location_type: row.work_location_type as WorkLocationType,
      wage_type: row.wage_type as string | null,
      wage_amount: row.wage_amount as number | null,
      wage_currency: row.wage_currency as string,
      work_duration: row.work_duration as string | null,
      skills_required: row.skills_required as string | null,
      requirements: row.requirements as string | null,
      status: row.status as JobStatus,
      urgency: row.urgency as UrgencyLevel,
      images: row.images as string | null,
      view_count: row.view_count as number,
      contact_count: row.contact_count as number,
      expires_at: row.expires_at as string | null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      category_name: row.category_name as string | undefined,
      employer_name: row.employer_name as string | undefined,
      seeker_name: row.seeker_name as string | undefined,
    }));
  } catch (error) {
    console.error("Error fetching general jobs:", error);
    return [];
  }
}

export async function getGeneralJobById(id: string): Promise<GeneralJob | null> {
  try {
    const result = await turso.execute(`
      SELECT
        j.*,
        jc.name as category_name,
        u1.name as employer_name,
        u2.name as seeker_name
      FROM jobs j
      LEFT JOIN job_categories jc ON j.category_id = jc.id
      LEFT JOIN users u1 ON j.employer_id = u1.id
      LEFT JOIN users u2 ON j.seeker_id = u2.id
      WHERE j.id = ?
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string | null,
      job_type: row.job_type as JobType,
      category_id: row.category_id as string | null,
      subcategory: row.subcategory as string | null,
      posting_type: row.posting_type as PostingType,
      employer_id: row.employer_id as string | null,
      seeker_id: row.seeker_id as string | null,
      contact_person: row.contact_person as string | null,
      contact_phone: row.contact_phone as string | null,
      contact_email: row.contact_email as string | null,
      location: row.location as string | null,
      coordinates: row.coordinates as string | null,
      work_location_type: row.work_location_type as WorkLocationType,
      wage_type: row.wage_type as string | null,
      wage_amount: row.wage_amount as number | null,
      wage_currency: row.wage_currency as string,
      work_duration: row.work_duration as string | null,
      skills_required: row.skills_required as string | null,
      requirements: row.requirements as string | null,
      status: row.status as JobStatus,
      urgency: row.urgency as UrgencyLevel,
      images: row.images as string | null,
      view_count: row.view_count as number,
      contact_count: row.contact_count as number,
      expires_at: row.expires_at as string | null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      category_name: row.category_name as string | undefined,
      employer_name: row.employer_name as string | undefined,
      seeker_name: row.seeker_name as string | undefined,
    };
  } catch (error) {
    console.error("Error fetching general job by ID:", error);
    return null;
  }
}

export async function createGeneralJob(data: JobData): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const imagesJson = data.images && data.images.length > 0 ? JSON.stringify(data.images) : null;
    const coordinatesJson = data.coordinates ? JSON.stringify(data.coordinates) : null;
    const skillsJson = data.skills_required && data.skills_required.length > 0 ? JSON.stringify(data.skills_required) : null;

    await turso.execute({
      sql: `
        INSERT INTO jobs (
          id, title, description, job_type, category_id, subcategory,
          posting_type, employer_id, seeker_id, contact_person, contact_phone,
          contact_email, location, coordinates, work_location_type, wage_type,
          wage_amount, wage_currency, work_duration, skills_required,
          requirements, status, urgency, images, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)
      `,
      args: [
        id,
        data.title,
        data.description || null,
        data.job_type,
        data.category_id || null,
        data.subcategory || null,
        data.posting_type,
        data.employer_id || null,
        data.seeker_id || null,
        data.contact_person || null,
        data.contact_phone || null,
        data.contact_email || null,
        data.location || null,
        coordinatesJson,
        data.work_location_type || 'onsite',
        data.wage_type || null,
        data.wage_amount || null,
        data.wage_currency || 'THB',
        data.work_duration || null,
        skillsJson,
        data.requirements || null,
        data.urgency || 'medium',
        imagesJson,
        data.expires_at || null,
      ],
    });

    revalidatePath("/jobs");
    return { success: true, id };
  } catch (error) {
    console.error("Error creating general job:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create job" };
  }
}

export async function updateGeneralJob(
  id: string,
  data: Partial<JobData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: string[] = [];
    const args: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'coordinates') {
          updates.push(`${key} = ?`);
          args.push(JSON.stringify(value));
        } else if (key === 'images' || key === 'skills_required') {
          updates.push(`${key} = ?`);
          args.push(value && (value as any[]).length > 0 ? JSON.stringify(value) : null);
        } else {
          updates.push(`${key} = ?`);
          args.push(value);
        }
      }
    });

    if (updates.length === 0) {
      return { success: true };
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(id);

    await turso.execute({
      sql: `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    console.error("Error updating general job:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update job" };
  }
}

export async function incrementJobViewCount(id: string): Promise<{ success: boolean }> {
  try {
    await turso.execute({
      sql: 'UPDATE jobs SET view_count = view_count + 1 WHERE id = ?',
      args: [id],
    });
    return { success: true };
  } catch (error) {
    console.error("Error incrementing job view count:", error);
    return { success: false };
  }
}

// Job Applications
export async function getJobApplications(jobId: string): Promise<JobApplication[]> {
  try {
    const result = await turso.execute(`
      SELECT ja.*, u.name as applicant_name
      FROM job_applications ja
      JOIN users u ON ja.applicant_id = u.id
      WHERE ja.job_id = ?
      ORDER BY ja.created_at DESC
    `, [jobId]);

    return result.rows.map((row: any) => ({
      id: row.id as string,
      job_id: row.job_id as string,
      applicant_id: row.applicant_id as string,
      message: row.message as string | null,
      status: row.status as "applied" | "viewed" | "contacted" | "rejected" | "accepted",
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      applicant_name: row.applicant_name as string | undefined,
    }));
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return [];
  }
}

export async function createJobApplication(
  jobId: string,
  applicantId: string,
  message?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await turso.execute({
      sql: `
        INSERT INTO job_applications (id, job_id, applicant_id, message, status)
        VALUES (?, ?, ?, ?, 'applied')
      `,
      args: [id, jobId, applicantId, message || null],
    });

    revalidatePath(`/jobs/${jobId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating job application:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to apply for job" };
  }
}

// Job Contacts (for tracking contact info access)
export async function showJobContact(jobId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user has already accessed contact info
    const existingContact = await turso.execute({
      sql: 'SELECT id FROM job_contacts WHERE job_id = ? AND user_id = ?',
      args: [jobId, userId],
    });

    if (existingContact.rows.length === 0) {
      // First time accessing
      const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await turso.execute({
        sql: 'INSERT INTO job_contacts (id, job_id, user_id, contact_shown) VALUES (?, ?, ?, TRUE)',
        args: [id, jobId, userId],
      });

      // Increment contact count on job
      await turso.execute({
        sql: 'UPDATE jobs SET contact_count = contact_count + 1 WHERE id = ?',
        args: [jobId],
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error showing job contact:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to show job contact" };
  }
}

// Export getJobs for compatibility


// Initialize default job categories
export async function initializeJobCategories(): Promise<{ success: boolean }> {
  try {
    const defaultCategories = [
      { name: "สอนพิเศษ", description: "สอนหนังสือ สอนพิเศษ ติวสอบ", icon: "graduation-cap" },
      { name: "ขับรถส่งของ", description: "ขับรถกระบะ รถส่งของ รถส่งสินค้า", icon: "truck" },
      { name: "ดูแลผู้สูงอายุ", description: "ดูแลผู้สูงอายุ พยาบาลแม่บ้าน", icon: "heart" },
      { name: "ทำความสะอาด", description: "ทำความสะอาดบ้าน ออฟฟิศ สถานที่", icon: "spray-can" },
      { name: "ประกอบอาหาร", description: "ประกอบอาหาร ทำอาหารสำหรับงานเลี้ยง", icon: "chef-hat" },
      { name: "รักษาความปลอดภัย", description: "ยาม รปภ. ดูแลความปลอดภัย", icon: "shield" },
      { name: "ทำสวน", description: "ดูแลสวน ตัดต้นไม้ จัดภูมิทัศน์", icon: "leaf" },
      { name: "ซ่อมบำรุง", description: "ซ่อมอุปกรณ์ บำรุงรักษาสถานที่", icon: "wrench" },
    ];

    for (let i = 0; i < defaultCategories.length; i++) {
      const category = defaultCategories[i];
      await createJobCategory(category.name, category.description, category.icon);
    }

    return { success: true };
  } catch (error) {
    console.error("Error initializing job categories:", error);
    return { success: false };
  }
}