import { api } from "encore.dev/api";
import { subscriptionDB } from "./db";
import { getAuthData } from "~encore/auth";

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  planType?: string;
  status?: string;
  currentPeriodEnd?: Date;
  userEmail?: string;
}

// Checks if the authenticated user has an active subscription.
export const checkSubscription = api<void, SubscriptionStatus>(
  { expose: true, method: "GET", path: "/polar/subscription/check", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    const subscription = await subscriptionDB.queryRow<{
      plan_type: string;
      status: string;
      current_period_end: Date;
      customer_email: string;
      created_at: Date;
    }>`
      SELECT plan_type, status, current_period_end, customer_email, created_at
      FROM subscriptions 
      WHERE customer_email = ${auth.email} 
        AND status = 'active'
        AND current_period_end > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        userEmail: auth.email
      };
    }

    // Verify the subscription belongs to this specific user
    if (subscription.customer_email !== auth.email) {
      return {
        hasActiveSubscription: false,
        userEmail: auth.email
      };
    }

    return {
      hasActiveSubscription: true,
      planType: subscription.plan_type,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      userEmail: auth.email
    };
  }
);
