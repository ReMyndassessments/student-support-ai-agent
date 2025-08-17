import { api } from "encore.dev/api";
import { resourceDB } from "./db";

export interface Category {
  name: string;
  count: number;
}

export interface ResourceType {
  name: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
  types: ResourceType[];
  concernTypes: string[];
  gradeLevels: string[];
  tags: string[];
}

// Retrieves available categories, types, and filter options for resources.
export const categories = api<void, CategoriesResponse>(
  { expose: true, method: "GET", path: "/resources/categories" },
  async () => {
    // Get categories with counts
    const categoryRows = await resourceDB.queryAll<{ category: string; count: number }>`
      SELECT category, COUNT(*) as count 
      FROM resources 
      GROUP BY category 
      ORDER BY category
    `;

    // Get types with counts
    const typeRows = await resourceDB.queryAll<{ type: string; count: number }>`
      SELECT type, COUNT(*) as count 
      FROM resources 
      GROUP BY type 
      ORDER BY type
    `;

    // Get all unique concern types
    const concernTypeRows = await resourceDB.queryAll<{ concern_types: string }>`
      SELECT DISTINCT concern_types FROM resources
    `;
    
    const concernTypesSet = new Set<string>();
    concernTypeRows.forEach(row => {
      const types = JSON.parse(row.concern_types) as string[];
      types.forEach(type => concernTypesSet.add(type));
    });

    // Get all unique grade levels
    const gradeLevelRows = await resourceDB.queryAll<{ grade_levels: string }>`
      SELECT DISTINCT grade_levels FROM resources
    `;
    
    const gradeLevelsSet = new Set<string>();
    gradeLevelRows.forEach(row => {
      const levels = JSON.parse(row.grade_levels) as string[];
      levels.forEach(level => gradeLevelsSet.add(level));
    });

    // Get all unique tags
    const tagRows = await resourceDB.queryAll<{ tags: string }>`
      SELECT DISTINCT tags FROM resources
    `;
    
    const tagsSet = new Set<string>();
    tagRows.forEach(row => {
      const tags = JSON.parse(row.tags) as string[];
      tags.forEach(tag => tagsSet.add(tag));
    });

    return {
      categories: categoryRows.map(row => ({ name: row.category, count: row.count })),
      types: typeRows.map(row => ({ name: row.type, count: row.count })),
      concernTypes: Array.from(concernTypesSet).sort(),
      gradeLevels: Array.from(gradeLevelsSet).sort(),
      tags: Array.from(tagsSet).sort()
    };
  }
);
