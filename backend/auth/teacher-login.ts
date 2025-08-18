import { api, Cookie } from "encore.dev/api";
import { userDB } from "../users/db";
import { APIError } from "encore.dev/api";

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

// Teacher login for demo purposes.
export const teacherLogin = api<TeacherLoginRequest, TeacherLoginResponse>(
  { expose: true, method: "POST", path: "/auth/teacher/login" },
  async (req) => {
    // For demo purposes, accept any email ending in .demo with password "demo"
    if (req.email.endsWith('.demo') && req.password === 'demo') {
      // Check if user exists in database
      let user = await userDB.queryRow<{
        id: number;
        email: string;
        name: string | null;
      }>`
        SELECT id, email, name FROM users WHERE email = ${req.email}
      `;

      // If user doesn't exist, create them
      if (!user) {
        const teacherName = req.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        user = await userDB.queryRow<{
          id: number;
          email: string;
          name: string | null;
        }>`
          INSERT INTO users (email, name, created_at, updated_at)
          VALUES (${req.email}, ${teacherName}, NOW(), NOW())
          RETURNING id, email, name
        `;
      }

      if (!user) {
        throw APIError.internal("Failed to create or retrieve user");
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

    throw APIError.unauthenticated("Invalid email or password");
  }
);
