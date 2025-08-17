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
        reason: `Feature requires ${suggestedPlan} plan or higher`,
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
  const featureMatrix: Record<string, string[]> = {
    'referral_creation': ['teacher', 'school', 'district'],
    'ai_recommendations': ['teacher', 'school', 'district'],
    'pdf_generation': ['teacher', 'school', 'district'],
    'email_sharing': ['teacher', 'school', 'district'],
    'follow_up_assistance': ['teacher', 'school', 'district'],
    'multi_teacher_collaboration': ['school', 'district'],
    'school_analytics': ['school', 'district'],
    'admin_dashboard': ['school', 'district'],
    'priority_support': ['school', 'district'],
    'custom_branding': ['school', 'district'],
    'data_export': ['school', 'district'],
    'district_analytics': ['district'],
    'custom_integrations': ['district'],
    'dedicated_account_manager': ['district'],
    'training_onboarding': ['district'],
    'sla_guarantee': ['district'],
    'white_label': ['district']
  };

  const allowedPlans = featureMatrix[feature] || [];
  return allowedPlans.includes(planType);
}

function getSuggestedPlan(feature: string, currentPlan: string): string {
  const featureMatrix: Record<string, string[]> = {
    'referral_creation': ['teacher', 'school', 'district'],
    'ai_recommendations': ['teacher', 'school', 'district'],
    'pdf_generation': ['teacher', 'school', 'district'],
    'email_sharing': ['teacher', 'school', 'district'],
    'follow_up_assistance': ['teacher', 'school', 'district'],
    'multi_teacher_collaboration': ['school', 'district'],
    'school_analytics': ['school', 'district'],
    'admin_dashboard': ['school', 'district'],
    'priority_support': ['school', 'district'],
    'custom_branding': ['school', 'district'],
    'data_export': ['school', 'district'],
    'district_analytics': ['district'],
    'custom_integrations': ['district'],
    'dedicated_account_manager': ['district'],
    'training_onboarding': ['district'],
    'sla_guarantee': ['district'],
    'white_label': ['district']
  };

  const allowedPlans = featureMatrix[feature] || ['teacher'];
  
  // Return the lowest tier plan that supports this feature
  if (allowedPlans.includes('teacher')) return 'teacher';
  if (allowedPlans.includes('school')) return 'school';
  return 'district';
}
