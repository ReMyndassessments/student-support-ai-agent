import { api, Cookie } from "encore.dev/api";

export interface AdminLogoutResponse {
  success: boolean;
  session: Cookie<"admin_session">;
}

// Admin logout for demo purposes.
export const adminLogout = api<void, AdminLogoutResponse>(
  { expose: true, method: "POST", path: "/auth/admin/logout" },
  async () => {
    return {
      success: true,
      session: {
        value: "",
        expires: new Date(0), // Expire immediately
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/"
      }
    };
  }
);
