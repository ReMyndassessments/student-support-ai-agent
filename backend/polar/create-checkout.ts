import { api } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";

const polarApiKey = secret("PolarApiKey");
const polarTeacherProductId = secret("PolarTeacherProductId");

export interface CreateCheckoutRequest {
  planType: 'teacher';
  successUrl: string;
  cancelUrl?: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
}

// Creates a Polar checkout session for subscription purchase.
export const createCheckout = api<CreateCheckoutRequest, CreateCheckoutResponse>(
  { expose: true, method: "POST", path: "/polar/checkout", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    console.log('Creating Polar checkout for user:', auth.email);
    
    const apiKey = polarApiKey();
    if (!apiKey) {
      console.error('Polar API key not configured');
      throw APIError.invalidArgument("Polar API key not configured. Please contact support for direct subscription setup.");
    }
    
    if (req.planType !== 'teacher') {
      throw APIError.invalidArgument("Invalid plan type specified.");
    }

    const productId = polarTeacherProductId();
    if (!productId) {
      console.error('Polar teacher product ID not configured');
      throw APIError.invalidArgument("Product ID not configured for teacher plan. Please contact support for direct subscription setup.");
    }

    try {
      // Create checkout session with Polar API
      const checkoutData = {
        product_id: productId,
        customer_email: auth.email,
        customer_name: auth.name || auth.email,
        success_url: req.successUrl,
        cancel_url: req.cancelUrl || req.successUrl,
        metadata: {
          plan_type: req.planType,
          customer_email: auth.email,
          user_id: auth.userID
        }
      };

      console.log('Sending request to Polar API with data:', {
        ...checkoutData,
        product_id: productId.substring(0, 10) + '...' // Log partial ID for security
      });

      const response = await fetch('https://api.polar.sh/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(checkoutData)
      });

      console.log('Polar API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Polar API error: ${response.status} - ${errorText}`);
        
        if (response.status === 401) {
          throw APIError.invalidArgument("Invalid Polar API key configuration. Please contact support for direct subscription setup.");
        } else if (response.status === 404) {
          throw APIError.invalidArgument("Product not found in Polar. Please contact support for direct subscription setup.");
        } else if (response.status === 400) {
          throw APIError.invalidArgument("Invalid request to payment system. Please contact support for direct subscription setup.");
        } else {
          throw APIError.internal("Payment system temporarily unavailable. Please contact support for direct subscription setup.");
        }
      }

      const checkout = await response.json();
      console.log('Polar checkout created successfully:', checkout.id);
      
      if (!checkout.url) {
        console.error('No checkout URL in Polar response:', checkout);
        throw APIError.internal("Invalid response from payment system. Please contact support for direct subscription setup.");
      }
      
      return {
        checkoutUrl: checkout.url,
        checkoutId: checkout.id
      };
    } catch (error) {
      console.error('Error creating Polar checkout:', error);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw APIError.internal("Unable to connect to payment system. Please contact support for direct subscription setup.");
        }
      }
      
      throw APIError.internal("Payment system error. Please contact support for direct subscription setup.");
    }
  }
);
