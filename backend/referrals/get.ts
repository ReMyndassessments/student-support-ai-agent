import { api } from "encore.dev/api";
import { referralDB } from "./db";
import { APIError } from "encore.dev/api";

export interface GetSupportRequestRequest {
  id: number;
}

export interface SupportRequest {
  id: number;
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  teacher: string;
  teacherPosition: string;
  incidentDate: string;
  location: string;
  concernTypes: string[];
  otherConcernType?: string;
  concernDescription: string;
  severityLevel: string;
  actionsTaken: string[];
  otherActionTaken?: string;
  aiRecommendations?: string;
  createdAt: Date;
}

// Retrieves a single support request by ID.
export const get = api<GetSupportRequestRequest, SupportRequest>(
  { expose: true, method: "GET", path: "/referrals/:id" },
  async (req) => {
    const row = await referralDB.queryRow<{
      id: number;
      student_first_name: string;
      student_last_initial: string;
      grade: string;
      teacher: string;
      teacher_position: string;
      incident_date: string;
      location: string;
      concern_types: string;
      other_concern_type: string | null;
      concern_description: string;
      severity_level: string;
      actions_taken: string;
      other_action_taken: string | null;
      ai_recommendations: string | null;
      created_at: Date;
    }>`
      SELECT * FROM referrals WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("Support request not found");
    }

    return {
      id: row.id,
      studentFirstName: row.student_first_name,
      studentLastInitial: row.student_last_initial,
      grade: row.grade,
      teacher: row.teacher,
      teacherPosition: row.teacher_position,
      incidentDate: row.incident_date,
      location: row.location,
      concernTypes: JSON.parse(row.concern_types),
      otherConcernType: row.other_concern_type || undefined,
      concernDescription: row.concern_description,
      severityLevel: row.severity_level,
      actionsTaken: JSON.parse(row.actions_taken),
      otherActionTaken: row.other_action_taken || undefined,
      aiRecommendations: row.ai_recommendations || undefined,
      createdAt: row.created_at
    };
  }
);
