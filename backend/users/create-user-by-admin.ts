import { api } from "encore.dev/api";
import { userDB } from "./db";
import { getAuthData } from "~encore/auth";
import { APIError } from "encore.dev/api";
import type { UserProfile } from "./get-profile";

export interface CreateUserByAdminRequest {
  email: string;
  name: string;
  schoolName?: string;
  schoolDistrict?: string;
  teacherType?: string;
  subscriptionEndDate?: string; // ISO 8601 date string
}

// Creates a new user (teacher). For admins only or self-signup.
export const createUserByAdmin = api<CreateUserByAdminRequest, UserProfile>(
  { expose: true, method: "POST", path: "/users/admin/create", auth: false },
  async (req) => {
    // Allow both admin access and self-signup (no auth required for self-signup)
    const auth = getAuthData();
    
    // If there is auth data, check if user is admin
    if (auth && !auth.isAdmin) {
      throw APIError.permissionDenied("You do not have permission to create users.");
    }

    // Check if user already exists
    const existing = await userDB.queryRow`SELECT id FROM users WHERE email = ${req.email}`;
    if (existing) {
      throw APIError.alreadyExists("A user with this email already exists.");
    }

    const subscriptionEndDate = req.subscriptionEndDate ? new Date(req.subscriptionEndDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year from now

    const user = await userDB.queryRow<any>`
      INSERT INTO users (
        email, name, school_name, school_district, teacher_type, 
        subscription_start_date, subscription_end_date,
        created_at, updated_at
      )
      VALUES (
        ${req.email}, ${req.name}, ${req.schoolName || null}, ${req.schoolDistrict || null}, ${req.teacherType || 'classroom'},
        NOW(), ${subscriptionEndDate},
        NOW(), NOW()
      )
      RETURNING 
        id, email, name, school_name, school_district, primary_grade, primary_subject, 
        class_id, additional_grades, additional_subjects, teacher_type, school_year,
        referrals_used_this_month, referrals_limit, additional_referral_packages,
        subscription_start_date, subscription_end_date, deepseek_api_key, created_at, updated_at
    `;

    if (!user) {
      throw APIError.internal("Failed to create user.");
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      schoolName: user.school_name || undefined,
      schoolDistrict: user.school_district || undefined,
      primaryGrade: user.primary_grade || undefined,
      primarySubject: user.primary_subject || undefined,
      classId: user.class_id || undefined,
      additionalGrades: user.additional_grades || undefined,
      additionalSubjects: user.additional_subjects || undefined,
      teacherType: user.teacher_type || undefined,
      schoolYear: user.school_year || undefined,
      supportRequestsUsedThisMonth: user.referrals_used_this_month,
      supportRequestsLimit: user.referrals_limit,
      additionalSupportRequestPackages: user.additional_referral_packages,
      subscriptionStartDate: user.subscription_start_date || undefined,
      subscriptionEndDate: user.subscription_end_date || undefined,
      hasDeepSeekApiKey: !!user.deepseek_api_key,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
);
