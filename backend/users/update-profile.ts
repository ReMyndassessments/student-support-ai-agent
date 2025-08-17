import { api } from "encore.dev/api";
import { userDB } from "./db";
import { APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface UpdateProfileRequest {
  name?: string;
  deepSeekApiKey?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  hasDeepSeekApiKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Updates the authenticated user's profile information.
export const updateProfile = api<UpdateProfileRequest, UserProfile>(
  { expose: true, method: "PUT", path: "/users/profile", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // First ensure user exists
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

    if (!user) {
      // Create user if doesn't exist
      user = await userDB.queryRow<{
        id: number;
        email: string;
        name: string | null;
        deepseek_api_key: string | null;
        created_at: Date;
        updated_at: Date;
      }>`
        INSERT INTO users (email, name, deepseek_api_key, created_at, updated_at)
        VALUES (${auth.email}, ${req.name || auth.name}, ${req.deepSeekApiKey || null}, NOW(), NOW())
        RETURNING id, email, name, deepseek_api_key, created_at, updated_at
      `;
    } else {
      // Update existing user
      user = await userDB.queryRow<{
        id: number;
        email: string;
        name: string | null;
        deepseek_api_key: string | null;
        created_at: Date;
        updated_at: Date;
      }>`
        UPDATE users 
        SET 
          name = COALESCE(${req.name || null}, name),
          deepseek_api_key = COALESCE(${req.deepSeekApiKey || null}, deepseek_api_key),
          updated_at = NOW()
        WHERE email = ${auth.email}
        RETURNING id, email, name, deepseek_api_key, created_at, updated_at
      `;
    }

    if (!user) {
      throw APIError.internal("Failed to update user profile");
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
