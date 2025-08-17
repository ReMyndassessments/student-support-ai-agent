import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { userDB } from "./db";
import { APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";

const adminDeepSeekKey = secret("AdminDeepSeekAPIKey");

export interface GetDeepSeekKeyRequest {
  email: Query<string>;
}

export interface DeepSeekKeyResponse {
  hasKey: boolean;
  key?: string;
}

// Retrieves user's DeepSeek API key for internal use.
export const getDeepSeekKey = api<GetDeepSeekKeyRequest, DeepSeekKeyResponse>(
  { expose: false, method: "GET", path: "/users/deepseek-key" },
  async (req) => {
    // Check if this is an admin request
    try {
      const auth = getAuthData();
      if (auth?.isAdmin && req.email === 'admin@concern2care.demo') {
        return {
          hasKey: true,
          key: adminDeepSeekKey()
        };
      }
    } catch (error) {
      // Not authenticated or not admin, continue with regular user lookup
    }

    const user = await userDB.queryRow<{
      deepseek_api_key: string | null;
    }>`
      SELECT deepseek_api_key
      FROM users 
      WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    return {
      hasKey: !!user.deepseek_api_key,
      key: user.deepseek_api_key || undefined
    };
  }
);
