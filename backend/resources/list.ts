import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { resourceDB } from "./db";

export interface ListResourcesRequest {
  limit?: Query<number>;
  category?: Query<string>;
  type?: Query<string>;
  concernType?: Query<string>;
  gradeLevel?: Query<string>;
  search?: Query<string>;
  tags?: Query<string>;
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

export interface ListResourcesResponse {
  resources: Resource[];
  totalCount: number;
}

// Retrieves resources with optional filtering and search capabilities.
export const list = api<ListResourcesRequest, ListResourcesResponse>(
  { expose: true, method: "GET", path: "/resources" },
  async (req) => {
    const limit = req.limit || 50;
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions based on filters
    if (req.category) {
      whereConditions.push(`category = $${paramIndex}`);
      params.push(req.category);
      paramIndex++;
    }

    if (req.type) {
      whereConditions.push(`type = $${paramIndex}`);
      params.push(req.type);
      paramIndex++;
    }

    if (req.concernType) {
      whereConditions.push(`concern_types::jsonb ? $${paramIndex}`);
      params.push(req.concernType);
      paramIndex++;
    }

    if (req.gradeLevel) {
      whereConditions.push(`grade_levels::jsonb ? $${paramIndex}`);
      params.push(req.gradeLevel);
      paramIndex++;
    }

    if (req.tags) {
      whereConditions.push(`tags::jsonb ? $${paramIndex}`);
      params.push(req.tags);
      paramIndex++;
    }

    if (req.search) {
      whereConditions.push(`(
        title ILIKE $${paramIndex} OR 
        description ILIKE $${paramIndex} OR 
        content ILIKE $${paramIndex}
      )`);
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    // Build the query
    let query = `
      SELECT 
        id, title, description, category, type, content, tags, concern_types, 
        grade_levels, difficulty_level, estimated_time, materials_needed, 
        is_customizable, created_at, updated_at
      FROM resources
    `;

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM resources`;
    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    const countResult = await resourceDB.rawQueryRow<{ total: number }>(
      countQuery, 
      ...params.slice(0, -1) // Remove limit parameter for count
    );
    const totalCount = countResult?.total || 0;

    // Get resources
    const rows = await resourceDB.rawQueryAll<{
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
    }>(query, ...params);

    const resources: Resource[] = rows.map(row => ({
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
    }));

    return { resources, totalCount };
  }
);
