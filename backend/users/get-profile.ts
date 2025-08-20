import { api } from "encore.dev/api";
import { userDB } from "./db";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";

const adminDeepSeekApiKey = secret("AdminDeepSeekAPIKey");

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  schoolName?: string;
  schoolDistrict?: string;
  primaryGrade?: string;
  primarySubject?: string;
  classId?: string;
  additionalGrades?: string[];
  additionalSubjects?: string[];
  teacherType?: string;
  schoolYear?: string;
  supportRequestsUsedThisMonth: number;
  supportRequestsLimit: number;
  additionalSupportRequestPackages: number;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  hasDeepSeekApiKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type UserRow = {
  id: number;
  email: string;
  name: string | null;
  school_name: string | null;
  school_district: string | null;
  primary_grade: string | null;
  primary_subject: string | null;
  class_id: string | null;
  additional_grades: string[] | null;
  additional_subjects: string[] | null;
  teacher_type: string | null;
  school_year: string | null;
  referrals_used_this_month: number;
  referrals_limit: number;
  additional_referral_packages: number;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
  deepseek_api_key: string | null;
  created_at: Date;
  updated_at: Date;
};

// Retrieves the authenticated user's profile information.
export const getProfile = api<void, UserProfile>(
  { expose: true, method: "GET", path: "/users/profile", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    let user = await userDB.queryRow<UserRow>`
      SELECT 
        id, email, name, school_name, school_district, primary_grade, primary_subject, 
        class_id, additional_grades, additional_subjects, teacher_type, school_year,
        referrals_used_this_month, referrals_limit, additional_referral_packages,
        subscription_start_date, subscription_end_date, deepseek_api_key, created_at, updated_at
      FROM users 
      WHERE email = ${auth.email}
    `;

    // Create user if doesn't exist
    if (!user) {
      user = await userDB.queryRow<UserRow>`
        INSERT INTO users (email, name, deepseek_api_key, created_at, updated_at)
        VALUES (${auth.email}, ${auth.name}, ${adminDeepSeekApiKey()}, NOW(), NOW())
        RETURNING 
          id, email, name, school_name, school_district, primary_grade, primary_subject, 
          class_id, additional_grades, additional_subjects, teacher_type, school_year,
          referrals_used_this_month, referrals_limit, additional_referral_packages,
          subscription_start_date, subscription_end_date, deepseek_api_key, created_at, updated_at
      `;
    } else if (!user.deepseek_api_key) {
      // If user exists but has no API key, update them with the admin key.
      user = await userDB.queryRow<UserRow>`
        UPDATE users
        SET deepseek_api_key = ${adminDeepSeekApiKey()}, updated_at = NOW()
        WHERE email = ${auth.email}
        RETURNING 
          id, email, name, school_name, school_district, primary_grade, primary_subject, 
          class_id, additional_grades, additional_subjects, teacher_type, school_year,
          referrals_used_this_month, referrals_limit, additional_referral_packages,
          subscription_start_date, subscription_end_date, deepseek_api_key, created_at, updated_at
      `;
    }

    if (!user) {
      throw new Error("Failed to create or retrieve user");
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
