import { api } from "encore.dev/api";
import { resourceDB } from "./db";
import { APIError } from "encore.dev/api";

export interface GetResourceRequest {
  id: number;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  content: string;
  tags: string[];
  concernTypes: string[];
  gradeLevels: string[];
  difficultyLevel: string;
  estimatedTime?: string;
  materialsNeeded?: string;
  isCustomizable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Retrieves a single resource by ID.
export const get = api<GetResourceRequest, Resource>(
  { expose: true, method: "GET", path: "/resources/:id" },
  async (req) => {
    const row = await resourceDB.queryRow<{
      id: number;
      title: string;
      description: string;
      category: string;
      type: string;
      content: string;
      tags: string;
      concern_types: string;
      grade_levels: string;
      difficulty_level: string;
      estimated_time: string | null;
      materials_needed: string | null;
      is_customizable: boolean;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM resources WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("Resource not found");
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      type: row.type,
      content: row.content,
      tags: JSON.parse(row.tags),
      concernTypes: JSON.parse(row.concern_types),
      gradeLevels: JSON.parse(row.grade_levels),
      difficultyLevel: row.difficulty_level,
      estimatedTime: row.estimated_time || undefined,
      materialsNeeded: row.materials_needed || undefined,
      isCustomizable: row.is_customizable,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
);
