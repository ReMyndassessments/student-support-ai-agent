import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { subscriptionDB } from "./db";

export interface CheckSubscriptionRequest {
  email: Query<string>;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  planType?: string;
  status?: string;
  currentPeriodEnd?: Date;
  isTrialPeriod?: boolean;
}

// Checks if a user has an active subscription.
export const checkSubscription = api<CheckSubscriptionRequest, SubscriptionStatus>(
  { expose: true, method: "GET", path: "/polar/subscription/check" },
  async (req) => {
    const subscription = await subscriptionDB.queryRow<{
      plan_type: string;
      status: string;
      current_period_end: Date;
      created_at: Date;
    }>`
      SELECT plan_type, status, current_period_end, created_at
      FROM subscriptions 
      WHERE customer_email = ${req.email} 
        AND status IN ('active', 'trialing')
        AND current_period_end > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!subscription) {
      return {
        hasActiveSubscription: false
      };
    }

    // Check if it's a trial period (within 14 days of creation)
    const trialPeriodDays = 14;
    const trialEndDate = new Date(subscription.created_at);
    trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);
    const isTrialPeriod = new Date() <= trialEndDate && subscription.status === 'trialing';

    return {
      hasActiveSubscription: true,
      planType: subscription.plan_type,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      isTrialPeriod
    };
  }
);
