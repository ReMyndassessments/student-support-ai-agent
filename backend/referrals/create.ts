import { api } from "encore.dev/api";
import { referralDB } from "./db";

export interface CreateReferralRequest {
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  teacher: string;
  concernDescription: string;
  additionalInfo?: string;
  aiRecommendations?: string;
}

export interface Referral {
  id: number;
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  teacher: string;
  concernDescription: string;
  additionalInfo?: string;
  aiRecommendations?: string;
  createdAt: Date;
}

// Creates a new student referral form.
export const create = api<CreateReferralRequest, Referral>(
  { expose: true, method: "POST", path: "/referrals" },
  async (req) => {
    const row = await referralDB.queryRow<{
      id: number;
      student_first_name: string;
      student_last_initial: string;
      grade: string;
      teacher: string;
      concern_description: string;
      additional_info: string | null;
      ai_recommendations: string | null;
      created_at: Date;
    }>`
      INSERT INTO referrals (
        student_first_name,
        student_last_initial,
        grade,
        teacher,
        concern_description,
        additional_info,
        ai_recommendations
      ) VALUES (
        ${req.studentFirstName},
        ${req.studentLastInitial},
        ${req.grade},
        ${req.teacher},
        ${req.concernDescription},
        ${req.additionalInfo || null},
        ${req.aiRecommendations || null}
      )
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to create referral");
    }

    return {
      id: row.id,
      studentFirstName: row.student_first_name,
      studentLastInitial: row.student_last_initial,
      grade: row.grade,
      teacher: row.teacher,
      concernDescription: row.concern_description,
      additionalInfo: row.additional_info || undefined,
      aiRecommendations: row.ai_recommendations || undefined,
      createdAt: row.created_at
    };
  }
);
