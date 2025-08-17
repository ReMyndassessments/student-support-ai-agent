import { api } from "encore.dev/api";
import { subscriptionDB } from "./db";
import { APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import crypto from "crypto";

export interface PolarWebhookRequest {
  type: string;
  data: any;
}

interface WebhookHeaders {
  signature: Header<"polar-signature">;
}

export interface PolarWebhookResponse {
  success: boolean;
}

// Handles Polar webhook events for subscription management.
export const webhook = api<PolarWebhookRequest & WebhookHeaders, PolarWebhookResponse>(
  { expose: true, method: "POST", path: "/polar/webhook" },
  async (req) => {
    try {
      // For demo purposes, we'll accept webhooks without signature verification
      // In production, you would verify the webhook signature
      
      console.log(`Processing Polar webhook: ${req.type}`);

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
        case 'checkout.created':
          await handleCheckoutCreated(req.data);
          break;
        case 'checkout.updated':
          await handleCheckoutUpdated(req.data);
          break;
        default:
          console.log(`Unhandled webhook type: ${req.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing Polar webhook:', error);
      if (error instanceof APIError) {
        throw error;
      }
      return { success: false };
    }
  }
);

async function handleSubscriptionCreated(data: any) {
  const subscription = data.subscription;
  const customer = data.customer;
  
  console.log('Creating subscription:', subscription.id);
  
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
      ${subscription.product?.name || 'unknown'},
      ${subscription.status},
      ${subscription.current_period_start ? new Date(subscription.current_period_start) : null},
      ${subscription.current_period_end ? new Date(subscription.current_period_end) : null},
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
  
  console.log('Updating subscription:', subscription.id);
  
  await subscriptionDB.exec`
    UPDATE subscriptions 
    SET 
      status = ${subscription.status},
      current_period_start = ${subscription.current_period_start ? new Date(subscription.current_period_start) : null},
      current_period_end = ${subscription.current_period_end ? new Date(subscription.current_period_end) : null},
      updated_at = NOW()
    WHERE polar_subscription_id = ${subscription.id}
  `;
}

async function handleSubscriptionCanceled(data: any) {
  const subscription = data.subscription;
  
  console.log('Canceling subscription:', subscription.id);
  
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
  
  console.log('Revoking subscription:', subscription.id);
  
  await subscriptionDB.exec`
    UPDATE subscriptions 
    SET 
      status = 'revoked',
      canceled_at = NOW(),
      updated_at = NOW()
    WHERE polar_subscription_id = ${subscription.id}
  `;
}

async function handleCheckoutCreated(data: any) {
  const checkout = data.checkout;
  console.log('Checkout created:', checkout.id);
  // You can add checkout tracking logic here if needed
}

async function handleCheckoutUpdated(data: any) {
  const checkout = data.checkout;
  console.log('Checkout updated:', checkout.id, 'Status:', checkout.status);
  
  // Handle successful checkout completion
  if (checkout.status === 'confirmed') {
    console.log('Checkout confirmed, subscription should be created automatically');
  }
}
