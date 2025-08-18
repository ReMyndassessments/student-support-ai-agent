import { api } from "encore.dev/api";
import { userDB } from "./db";
import { getAuthData } from "~encore/auth";
import { APIError } from "encore.dev/api";
import type { UserProfile } from "./get-profile";

export interface UpdateUserByAdminRequest {
  id: number; // from path
  name?: string;
  email?: string;
  schoolName?: string;
  schoolDistrict?: string;
  teacherType?: string;
  subscriptionEndDate?: string; // ISO 8601 date string
  supportRequestsLimit?: number;
}

// Updates a user's profile. For admins only or self-signup follow-up.
export const updateUserByAdmin = api<UpdateUserByAdminRequest, UserProfile>(
  { expose: true, method: "PUT", path: "/users/admin/:id", auth: false },
  async (req) => {
    // Allow both admin access and self-signup follow-up (no auth required for self-signup)
    const auth = getAuthData();
    
    // If there is auth data, check if user is admin
    if (auth && !auth.isAdmin) {
      throw APIError.permissionDenied("You do not have permission to update users.");
    }

    const subscriptionEndDate = req.subscriptionEndDate ? new Date(req.subscriptionEndDate) : undefined;

    const user = await userDB.queryRow<any>`
      UPDATE users
      SET
        name = COALESCE(${req.name || null}, name),
        email = COALESCE(${req.email || null}, email),
        school_name = COALESCE(${req.schoolName || null}, school_name),
        school_district = COALESCE(${req.schoolDistrict || null}, school_district),
        teacher_type = COALESCE(${req.teacherType || null}, teacher_type),
        subscription_end_date = COALESCE(${subscriptionEndDate}, subscription_end_date),
        referrals_limit = COALESCE(${req.supportRequestsLimit || null}, referrals_limit),
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING
        id, email, name, school_name, school_district, primary_grade, primary_subject, 
        class_id, additional_grades, additional_subjects, teacher_type, school_year,
        referrals_used_this_month, referrals_limit, additional_referral_packages,
        subscription_start_date, subscription_end_date, deepseek_api_key, created_at, updated_at
    `;

    if (!user) {
      throw APIError.notFound("User not found.");
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
