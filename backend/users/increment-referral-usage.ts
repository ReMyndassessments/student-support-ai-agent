import { api } from "encore.dev/api";
import { userDB } from "./db";
import { APIError } from "encore.dev/api";

export interface IncrementReferralUsageRequest {
  email: string;
}

export interface IncrementReferralUsageResponse {
  success: boolean;
  newUsageCount: number;
}

// Increments the user's monthly referral usage count.
export const incrementReferralUsage = api<IncrementReferralUsageRequest, IncrementReferralUsageResponse>(
  { expose: false, method: "POST", path: "/users/increment-referral-usage" },
  async (req) => {
    // For demo admin, just return success without incrementing
    if (req.email === 'admin@concern2care.demo') {
      return {
        success: true,
        newUsageCount: 1
      };
    }

    const result = await userDB.queryRow<{
      referrals_used_this_month: number;
    }>`
      UPDATE users 
      SET 
        referrals_used_this_month = referrals_used_this_month + 1,
        updated_at = NOW()
      WHERE email = ${req.email}
      RETURNING referrals_used_this_month
    `;

    if (!result) {
      throw APIError.notFound("User not found");
    }

    return {
      success: true,
      newUsageCount: result.referrals_used_this_month
    };
  }
);
