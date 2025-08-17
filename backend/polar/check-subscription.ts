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
        AND status = 'active'
        AND current_period_end > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!subscription) {
      return {
        hasActiveSubscription: false
      };
    }

    return {
      hasActiveSubscription: true,
      planType: subscription.plan_type,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
    };
  }
);
