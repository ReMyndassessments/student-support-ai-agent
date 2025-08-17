import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { subscriptionDB } from "./db";

export interface ListSubscriptionsRequest {
  limit?: Query<number>;
  status?: Query<string>;
}

export interface Subscription {
  id: number;
  polarSubscriptionId: string;
  customerEmail: string;
  customerName?: string;
  planType: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListSubscriptionsResponse {
  subscriptions: Subscription[];
}

// Lists all subscriptions with optional filtering.
export const listSubscriptions = api<ListSubscriptionsRequest, ListSubscriptionsResponse>(
  { expose: true, method: "GET", path: "/polar/subscriptions" },
  async (req) => {
    const limit = req.limit || 50;
    let query = `
      SELECT 
        id,
        polar_subscription_id,
        customer_email,
        customer_name,
        plan_type,
        status,
        current_period_start,
        current_period_end,
        canceled_at,
        created_at,
        updated_at
      FROM subscriptions
    `;
    
    const params: any[] = [];
    
    if (req.status) {
      query += ` WHERE status = $1`;
      params.push(req.status);
      query += ` ORDER BY created_at DESC LIMIT $2`;
      params.push(limit);
    } else {
      query += ` ORDER BY created_at DESC LIMIT $1`;
      params.push(limit);
    }

    const rows = await subscriptionDB.rawQueryAll<{
      id: number;
      polar_subscription_id: string;
      customer_email: string;
      customer_name: string | null;
      plan_type: string;
      status: string;
      current_period_start: Date | null;
      current_period_end: Date | null;
      canceled_at: Date | null;
      created_at: Date;
      updated_at: Date;
    }>(query, ...params);

    const subscriptions: Subscription[] = rows.map(row => ({
      id: row.id,
      polarSubscriptionId: row.polar_subscription_id,
      customerEmail: row.customer_email,
      customerName: row.customer_name || undefined,
      planType: row.plan_type,
      status: row.status,
      currentPeriodStart: row.current_period_start || undefined,
      currentPeriodEnd: row.current_period_end || undefined,
      canceledAt: row.canceled_at || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return { subscriptions };
  }
);
