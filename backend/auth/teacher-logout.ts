import { api, Cookie } from "encore.dev/api";

export interface TeacherLogoutResponse {
  success: boolean;
  session: Cookie<"teacher_session">;
}

// Teacher logout for demo purposes.
export const teacherLogout = api<void, TeacherLogoutResponse>(
  { expose: true, method: "POST", path: "/auth/teacher/logout" },
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
