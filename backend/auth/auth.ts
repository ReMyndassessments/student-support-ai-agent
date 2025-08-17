import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");
const clerkClient = createClerkClient({ secretKey: clerkSecretKey() });

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

// Configure the authorized parties.
// TODO: Configure this for your own domain when deploying to production.
const AUTHORIZED_PARTIES = [
  "https://*.lp.dev",
];

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

    // Check for authorization header (Clerk JWT token)
    if (data.authorization) {
      const token = data.authorization.replace("Bearer ", "");
      
      // For demo purposes, accept a simple demo token
      if (token === 'demo-admin-token') {
        return {
          userID: 'admin',
          email: 'admin@concern2care.demo',
          isAdmin: true,
          name: 'Demo Administrator'
        };
      }

      // Verify Clerk JWT token
      try {
        const verifiedToken = await clerkClient.verifyToken(token, {
          authorizedParties: AUTHORIZED_PARTIES,
          secretKey: clerkSecretKey(),
        });

        const user = await clerkClient.users.getUser(verifiedToken.sub);
        
        return {
          userID: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          isAdmin: false,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddresses[0]?.emailAddress || 'User'
        };
      } catch (err) {
        console.error('Error verifying Clerk token:', err);
        throw APIError.unauthenticated("Invalid authentication token");
      }
    }

    throw APIError.unauthenticated("Please log in to access this feature");
  }
);

// Configure the API gateway to use the auth handler
export const gw = new Gateway({ authHandler: auth });
