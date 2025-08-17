import { api, Cookie } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";

const adminPassword = secret("AdminDemoPassword");

export interface AdminLoginRequest {
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  session: Cookie<"admin_session">;
  user: {
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

// Admin login for demo purposes.
export const adminLogin = api<AdminLoginRequest, AdminLoginResponse>(
  { expose: true, method: "POST", path: "/auth/admin/login" },
  async (req) => {
    if (req.password !== adminPassword()) {
      throw APIError.unauthenticated("Invalid admin password");
    }

    // Create session data
    const sessionData = {
      isAdmin: true,
      email: 'admin@concern2care.demo',
      name: 'Demo Administrator',
      loginTime: new Date().toISOString()
    };

    // Encode session as base64
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    return {
      success: true,
      session: {
        value: sessionToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/"
      },
      user: {
        email: 'admin@concern2care.demo',
        name: 'Demo Administrator',
        isAdmin: true
      }
    };
  }
);
