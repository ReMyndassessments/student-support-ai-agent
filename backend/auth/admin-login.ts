import { api, Cookie } from "encore.dev/api";
import { APIError } from "encore.dev/api";

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
    // For demo purposes, use a simple hardcoded password
    // Accept multiple common demo passwords for flexibility
    const validPasswords = ["demo2024", "demo", "admin", "password"];
    
    if (!validPasswords.includes(req.password.toLowerCase())) {
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
