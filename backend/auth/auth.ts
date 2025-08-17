import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const adminPassword = secret("AdminDemoPassword");

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"admin_session">;
}

export interface AuthData {
  userID: string;
  email: string;
  isAdmin: boolean;
  name: string;
}

const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    // Check for admin session cookie first
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

    // Check for authorization header (for API access)
    if (data.authorization) {
      const token = data.authorization.replace("Bearer ", "");
      
      // Check if it's the admin demo password
      if (token === adminPassword()) {
        return {
          userID: 'admin',
          email: 'admin@concern2care.demo',
          isAdmin: true,
          name: 'Demo Administrator'
        };
      }
    }

    // For demo purposes, allow any email that looks like a teacher email
    // This is just for demonstration - in production you'd have proper auth
    throw APIError.unauthenticated("Please log in to access this feature");
  }
);

// Configure the API gateway to use the auth handler
export const gw = new Gateway({ authHandler: auth });
