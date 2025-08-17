import { api } from "encore.dev/api";
import { APIError } from "encore.dev/api";

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

// Creates a Polar checkout session for subscription purchase.
export const createCheckout = api<CreateCheckoutRequest, CreateCheckoutResponse>(
  { expose: true, method: "POST", path: "/polar/checkout" },
  async (req) => {
    // For demo purposes, return a mock checkout response
    // In production, this would integrate with Polar's actual API
    
    const mockCheckoutId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For demo, redirect to a mock checkout page or back to success
    const mockCheckoutUrl = `${req.successUrl}?demo=true&plan=${req.planType}&email=${encodeURIComponent(req.customerEmail)}`;
    
    // Log the checkout attempt for demo purposes
    console.log(`Demo checkout created for ${req.customerEmail} - ${req.planType} plan`);
    
    return {
      checkoutUrl: mockCheckoutUrl,
      checkoutId: mockCheckoutId
    };
  }
);
