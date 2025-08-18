import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { userDB } from "./db";
import { APIError } from "encore.dev/api";

export interface CheckReferralLimitRequest {
  email: Query<string>;
}

export interface ReferralLimitResponse {
  canCreateReferral: boolean;
  referralsUsed: number;
  referralsLimit: number;
  additionalPackages: number;
  totalLimit: number;
  reason?: string;
}

// Checks if a user can create a new referral based on their monthly limit.
export const checkReferralLimit = api<CheckReferralLimitRequest, ReferralLimitResponse>(
  { expose: false, method: "GET", path: "/users/check-referral-limit" },
  async (req) => {
    // For demo admin, always allow
    if (req.email === 'admin@concern2care.demo') {
      return {
        canCreateReferral: true,
        referralsUsed: 0,
        referralsLimit: 999,
        additionalPackages: 0,
        totalLimit: 999
      };
    }

    const user = await userDB.queryRow<{
      referrals_used_this_month: number;
      referrals_limit: number;
      additional_referral_packages: number;
      subscription_end_date: Date | null;
    }>`
      SELECT referrals_used_this_month, referrals_limit, additional_referral_packages, subscription_end_date
      FROM users 
      WHERE email = ${req.email}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    // Check if subscription is active
    if (!user.subscription_end_date || user.subscription_end_date < new Date()) {
      return {
        canCreateReferral: false,
        referralsUsed: user.referrals_used_this_month,
        referralsLimit: user.referrals_limit,
        additionalPackages: user.additional_referral_packages,
        totalLimit: user.referrals_limit + (user.additional_referral_packages * 10),
        reason: "Subscription expired or inactive"
      };
    }

    const totalLimit = user.referrals_limit + (user.additional_referral_packages * 10);
    const canCreate = user.referrals_used_this_month < totalLimit;

    return {
      canCreateReferral: canCreate,
      referralsUsed: user.referrals_used_this_month,
      referralsLimit: user.referrals_limit,
      additionalPackages: user.additional_referral_packages,
      totalLimit,
      reason: canCreate ? undefined : "Monthly referral limit reached"
    };
  }
);
