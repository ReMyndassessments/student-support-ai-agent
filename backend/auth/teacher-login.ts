import { api, Cookie } from "encore.dev/api";
import { userDB } from "../users/db";
import { APIError } from "encore.dev/api";
import * as bcrypt from "bcrypt";

export interface TeacherLoginRequest {
  email: string;
  password: string;
}

export interface TeacherLoginResponse {
  success: boolean;
  session: Cookie<"teacher_session">;
  user: {
    email: string;
    name: string;
    isAdmin: boolean;
  };
}

// Teacher login with email and password authentication.
export const teacherLogin = api<TeacherLoginRequest, TeacherLoginResponse>(
  { expose: true, method: "POST", path: "/auth/teacher/login" },
  async (req) => {
    if (!req.email || !req.password) {
      throw APIError.invalidArgument("Email and password are required");
    }

    // Find user by email
    const user = await userDB.queryRow<{
      id: number;
      email: string;
      name: string | null;
      password_hash: string | null;
      subscription_end_date: Date | null;
    }>`
      SELECT id, email, name, password_hash, subscription_end_date
      FROM users 
      WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    if (!user.password_hash) {
      throw APIError.unauthenticated("Account not properly configured. Please contact your administrator.");
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(req.password, user.password_hash);
    if (!passwordMatch) {
      throw APIError.unauthenticated("Invalid email or password");
    }

    // Check if subscription is active
    if (!user.subscription_end_date || user.subscription_end_date < new Date()) {
      throw APIError.permissionDenied("Your subscription has expired. Please contact your administrator.");
    }

    // Create session data
    const sessionData = {
      isAdmin: false,
      email: user.email,
      name: user.name || 'Teacher',
      userId: user.id,
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
        email: user.email,
        name: user.name || 'Teacher',
        isAdmin: false
      }
    };
  }
);
