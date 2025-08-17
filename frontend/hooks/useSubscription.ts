import { useState, useEffect } from 'react';
import backend from '~backend/client';
import type { SubscriptionStatus } from '~backend/polar/check-subscription';

export function useSubscription(userEmail: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      checkSubscription();
    }
  }, [userEmail]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await backend.polar.checkSubscription({ email: userEmail });
      setStatus(response);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Failed to check subscription status');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    checkSubscription();
  };

  return {
    status,
    loading,
    error,
    refresh,
    hasActiveSubscription: status?.hasActiveSubscription || false,
    planType: status?.planType
  };
}
