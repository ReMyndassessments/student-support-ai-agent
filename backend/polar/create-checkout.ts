import { api } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

const polarApiKey = secret("PolarApiKey");

export interface CreateCheckoutRequest {
  customerEmail: string;
  customerName?: string;
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
  { expose: true, method: "POST", path: "/polar/checkout" },
  async (req) => {
    const apiKey = polarApiKey();
    const productId = PRODUCT_IDS[req.planType]();
    
    if (!apiKey) {
      throw APIError.invalidArgument("Polar API key not configured. Please contact support.");
    }
    
    if (!productId) {
      throw APIError.invalidArgument(`Product ID not configured for ${req.planType} plan. Please contact support.`);
    }

    try {
      // Create checkout session with Polar API
      const checkoutData = {
        product_id: productId,
        customer_email: req.customerEmail,
        customer_name: req.customerName,
        success_url: req.successUrl,
        cancel_url: req.cancelUrl || req.successUrl,
        metadata: {
          plan_type: req.planType,
          customer_email: req.customerEmail
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
      
      console.log(`Checkout created for ${req.customerEmail} - ${req.planType} plan: ${checkout.id}`);
      
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
