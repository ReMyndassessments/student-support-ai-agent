import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { referralDB } from "./db";

export interface ListReferralsRequest {
  limit?: Query<number>;
  teacher?: Query<string>;
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

export interface ListReferralsResponse {
  referrals: Referral[];
}

// Retrieves all referrals, optionally filtered by teacher.
export const list = api<ListReferralsRequest, ListReferralsResponse>(
  { expose: true, method: "GET", path: "/referrals" },
  async (req) => {
    const limit = req.limit || 50;
    let query = `
      SELECT 
        id,
        student_first_name,
        student_last_initial,
        grade,
        teacher,
        concern_description,
        additional_info,
        ai_recommendations,
        created_at
      FROM referrals
    `;
    
    const params: any[] = [];
    
    if (req.teacher) {
      query += ` WHERE teacher = $1`;
      params.push(req.teacher);
      query += ` ORDER BY created_at DESC LIMIT $2`;
      params.push(limit);
    } else {
      query += ` ORDER BY created_at DESC LIMIT $1`;
      params.push(limit);
    }

    const rows = await referralDB.rawQueryAll<{
      id: number;
      student_first_name: string;
      student_last_initial: string;
      grade: string;
      teacher: string;
      concern_description: string;
      additional_info: string | null;
      ai_recommendations: string | null;
      created_at: Date;
    }>(query, ...params);

    const referrals: Referral[] = rows.map(row => ({
      id: row.id,
      studentFirstName: row.student_first_name,
      studentLastInitial: row.student_last_initial,
      grade: row.grade,
      teacher: row.teacher,
      concernDescription: row.concern_description,
      additionalInfo: row.additional_info || undefined,
      aiRecommendations: row.ai_recommendations || undefined,
      createdAt: row.created_at
    }));

    return { referrals };
  }
);
