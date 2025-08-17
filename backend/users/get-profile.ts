import { api } from "encore.dev/api";
import { userDB } from "./db";
import { getAuthData } from "~encore/auth";

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  hasDeepSeekApiKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Retrieves the authenticated user's profile information.
export const getProfile = api<void, UserProfile>(
  { expose: true, method: "GET", path: "/users/profile", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    let user = await userDB.queryRow<{
      id: number;
      email: string;
      name: string | null;
      deepseek_api_key: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, email, name, deepseek_api_key, created_at, updated_at
      FROM users 
      WHERE email = ${auth.email}
    `;

    // Create user if doesn't exist
    if (!user) {
      user = await userDB.queryRow<{
        id: number;
        email: string;
        name: string | null;
        deepseek_api_key: string | null;
        created_at: Date;
        updated_at: Date;
      }>`
        INSERT INTO users (email, name, created_at, updated_at)
        VALUES (${auth.email}, ${auth.name}, NOW(), NOW())
        RETURNING id, email, name, deepseek_api_key, created_at, updated_at
      `;
    }

    if (!user) {
      throw new Error("Failed to create or retrieve user");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      hasDeepSeekApiKey: !!user.deepseek_api_key,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
);
