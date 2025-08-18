import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { userDB } from "../users/db";

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"admin_session">;
  teacherSession?: Cookie<"teacher_session">;
}

export interface AuthData {
  userID: string;
  email: string;
  isAdmin: boolean;
  name: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    // Check for admin session cookie first (for demo purposes)
    if (data.session?.value) {
      try {
        const sessionData = JSON.parse(Buffer.from(data.session.value, 'base64').toString());
        if (sessionData.isAdmin && sessionData.email === 'admin@concern2care.demo') {
          return {
            userID: 'admin',
            email: 'admin@concern2care.demo',
            isAdmin: true,
            name: 'Demo Administrator'
          };
        }
      } catch (error) {
        // Invalid session, continue to other auth methods
      }
    }

    // Check for teacher session cookie
    if (data.teacherSession?.value) {
      try {
        const sessionData = JSON.parse(Buffer.from(data.teacherSession.value, 'base64').toString());
        if (sessionData.email && sessionData.userId) {
          // Verify user still exists in database
          const user = await userDB.queryRow<{
            id: number;
            email: string;
            name: string | null;
          }>`
            SELECT id, email, name FROM users WHERE id = ${sessionData.userId}
          `;

          if (user) {
            return {
              userID: user.id.toString(),
              email: user.email,
              isAdmin: false,
              name: user.name || 'Teacher'
            };
          }
        }
      } catch (error) {
        // Invalid session, continue to other auth methods
      }
    }

    throw APIError.unauthenticated("Please log in to access this feature");
  }
);

// Configure the API gateway to use the auth handler
export const gw = new Gateway({ authHandler: auth });
