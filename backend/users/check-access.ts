import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { subscriptionDB } from "../polar/db";
import { APIError } from "encore.dev/api";

export interface CheckAccessRequest {
  email: Query<string>;
  feature: Query<string>;
}

export interface AccessResponse {
  hasAccess: boolean;
  reason?: string;
  planType?: string;
  subscriptionStatus?: string;
  requiresUpgrade?: boolean;
  suggestedPlan?: string;
}

// Checks if a user has access to a specific feature based on their subscription.
export const checkAccess = api<CheckAccessRequest, AccessResponse>(
  { expose: true, method: "GET", path: "/users/check-access" },
  async (req) => {
    // For demo admin, always grant access
    if (req.email === 'admin@concern2care.demo') {
      return {
        hasAccess: true,
        planType: 'admin',
        subscriptionStatus: 'active'
      };
    }

    // Check for active subscription
    const subscription = await subscriptionDB.queryRow<{
      plan_type: string;
      status: string;
      current_period_end: Date;
      customer_email: string;
    }>`
      SELECT plan_type, status, current_period_end, customer_email
      FROM subscriptions 
      WHERE customer_email = ${req.email} 
        AND status = 'active'
        AND current_period_end > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!subscription) {
      return {
        hasAccess: false,
        reason: "No active subscription found",
        requiresUpgrade: true,
        suggestedPlan: "teacher"
      };
    }

    // Verify the subscription belongs to this specific user
    if (subscription.customer_email !== req.email) {
      return {
        hasAccess: false,
        reason: "Subscription not associated with this user account",
        requiresUpgrade: true,
        suggestedPlan: "teacher"
      };
    }

    // Check feature access based on plan type
    const planType = subscription.plan_type;
    const hasFeatureAccess = checkFeatureAccess(req.feature, planType);

    if (!hasFeatureAccess) {
      const suggestedPlan = getSuggestedPlan(req.feature, planType);
      return {
        hasAccess: false,
        reason: `This feature requires an active subscription.`,
        planType,
        subscriptionStatus: subscription.status,
        requiresUpgrade: true,
        suggestedPlan
      };
    }

    return {
      hasAccess: true,
      planType,
      subscriptionStatus: subscription.status
    };
  }
);

function checkFeatureAccess(feature: string, planType: string): boolean {
  // All features are available on the teacher plan.
  const allowedPlans = ['teacher'];
  return allowedPlans.includes(planType);
}

function getSuggestedPlan(feature: string, currentPlan: string): string {
  // Since there's only a teacher plan, it's always the suggested plan.
  return 'teacher';
}
