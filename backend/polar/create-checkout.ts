import { api } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";

const polarApiKey = secret("PolarApiKey");

export interface CreateCheckoutRequest {
  planType: 'teacher' | 'school' | 'district';
  successUrl: string;
  cancelUrl?: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
}

// Product IDs for each plan - these need to be configured in Polar
const PRODUCT_IDS = {
  teacher: secret("PolarTeacherProductId"),
  school: secret("PolarSchoolProductId"),
  district: secret("PolarDistrictProductId")
};

// Creates a Polar checkout session for subscription purchase.
export const createCheckout = api<CreateCheckoutRequest, CreateCheckoutResponse>(
  { expose: true, method: "POST", path: "/polar/checkout", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const apiKey = polarApiKey();
    
    if (!apiKey) {
      throw APIError.invalidArgument("Polar API key not configured. Please contact support.");
    }
    
    const productId = PRODUCT_IDS[req.planType]();
    if (!productId) {
      throw APIError.invalidArgument(`Product ID not configured for ${req.planType} plan. Please contact support.`);
    }

    try {
      // Create checkout session with Polar API
      // IMPORTANT: Use the authenticated user's email, not a provided email
      const checkoutData = {
        product_id: productId,
        customer_email: auth.email,
        customer_name: auth.name,
        success_url: req.successUrl,
        cancel_url: req.cancelUrl || req.successUrl,
        metadata: {
          plan_type: req.planType,
          customer_email: auth.email,
          user_id: auth.userID
        }
      };

      const response = await fetch('https://api.polar.sh/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Polar API error: ${response.status} - ${errorText}`);
        throw new Error(`Polar API error: ${response.status}`);
      }

      const checkout = await response.json();
      
      console.log(`Checkout created for ${auth.email} - ${req.planType} plan: ${checkout.id}`);
      
      return {
        checkoutUrl: checkout.url,
        checkoutId: checkout.id
      };
    } catch (error) {
      console.error('Error creating Polar checkout:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw APIError.invalidArgument("Invalid Polar API key. Please check configuration.");
      }
      
      if (error instanceof Error && error.message.includes('404')) {
        throw APIError.invalidArgument("Product not found. Please check product configuration.");
      }
      
      throw APIError.internal("Failed to create checkout session. Please try again or contact support.");
    }
  }
);
