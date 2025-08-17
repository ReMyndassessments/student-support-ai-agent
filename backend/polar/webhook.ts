import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { subscriptionDB } from "./db";

const polarWebhookSecret = secret("PolarWebhookSecret");

export interface PolarWebhookRequest {
  type: string;
  data: any;
}

export interface PolarWebhookResponse {
  success: boolean;
}

// Handles Polar webhook events for subscription management.
export const webhook = api<PolarWebhookRequest, PolarWebhookResponse>(
  { expose: true, method: "POST", path: "/polar/webhook" },
  async (req) => {
    try {
      // Verify webhook signature in production
      // const signature = req.headers['polar-signature'];
      // if (!verifyWebhookSignature(signature, req.body, polarWebhookSecret())) {
      //   throw APIError.unauthenticated("Invalid webhook signature");
      // }

      switch (req.type) {
        case 'subscription.created':
          await handleSubscriptionCreated(req.data);
          break;
        case 'subscription.updated':
          await handleSubscriptionUpdated(req.data);
          break;
        case 'subscription.canceled':
          await handleSubscriptionCanceled(req.data);
          break;
        case 'subscription.revoked':
          await handleSubscriptionRevoked(req.data);
          break;
        default:
          console.log(`Unhandled webhook type: ${req.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing Polar webhook:', error);
      return { success: false };
    }
  }
);

async function handleSubscriptionCreated(data: any) {
  const subscription = data.subscription;
  const customer = data.customer;
  
  await subscriptionDB.exec`
    INSERT INTO subscriptions (
      polar_subscription_id,
      customer_email,
      customer_name,
      plan_type,
      status,
      current_period_start,
      current_period_end,
      created_at,
      updated_at
    ) VALUES (
      ${subscription.id},
      ${customer.email},
      ${customer.name || ''},
      ${subscription.product.name},
      ${subscription.status},
      ${new Date(subscription.current_period_start)},
      ${new Date(subscription.current_period_end)},
      NOW(),
      NOW()
    )
    ON CONFLICT (polar_subscription_id) 
    DO UPDATE SET
      status = EXCLUDED.status,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW()
  `;
}

async function handleSubscriptionUpdated(data: any) {
  const subscription = data.subscription;
  
  await subscriptionDB.exec`
    UPDATE subscriptions 
    SET 
      status = ${subscription.status},
      current_period_start = ${new Date(subscription.current_period_start)},
      current_period_end = ${new Date(subscription.current_period_end)},
      updated_at = NOW()
    WHERE polar_subscription_id = ${subscription.id}
  `;
}

async function handleSubscriptionCanceled(data: any) {
  const subscription = data.subscription;
  
  await subscriptionDB.exec`
    UPDATE subscriptions 
    SET 
      status = 'canceled',
      canceled_at = NOW(),
      updated_at = NOW()
    WHERE polar_subscription_id = ${subscription.id}
  `;
}

async function handleSubscriptionRevoked(data: any) {
  const subscription = data.subscription;
  
  await subscriptionDB.exec`
    UPDATE subscriptions 
    SET 
      status = 'revoked',
      canceled_at = NOW(),
      updated_at = NOW()
    WHERE polar_subscription_id = ${subscription.id}
  `;
}
