import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";

const polarApiKey = secret("PolarAPIKey");
const polarOrganizationId = secret("PolarOrganizationId");

// Product IDs for each plan - these need to be configured in Polar dashboard
const teacherProductId = secret("PolarTeacherProductId");
const schoolProductId = secret("PolarSchoolProductId");
const districtProductId = secret("PolarDistrictProductId");

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
    const productIds = {
      teacher: teacherProductId(),
      school: schoolProductId(),
      district: districtProductId()
    };

    const productId = productIds[req.planType];
    if (!productId) {
      throw APIError.invalidArgument(`Product ID not configured for plan type: ${req.planType}`);
    }

    try {
      const response = await fetch('https://api.polar.sh/v1/checkouts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${polarApiKey()}`
        },
        body: JSON.stringify({
          organization_id: polarOrganizationId(),
          product_id: productId,
          customer_email: req.customerEmail,
          customer_name: req.customerName,
          success_url: req.successUrl,
          cancel_url: req.cancelUrl || req.successUrl,
          metadata: {
            plan_type: req.planType,
            source: 'concern2care'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Polar API error:', response.status, errorData);
        throw APIError.internal(`Failed to create checkout: ${response.status}`);
      }

      const checkout = await response.json();
      
      return {
        checkoutUrl: checkout.url,
        checkoutId: checkout.id
      };
    } catch (error) {
      console.error('Error creating Polar checkout:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal('Failed to create checkout session');
    }
  }
);
