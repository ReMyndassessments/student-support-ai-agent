import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';
import type { SubscriptionStatus } from '~backend/polar/check-subscription';

export function useSubscription(userEmail?: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      checkSubscription();
    } else {
      setLoading(false);
      setStatus({ hasActiveSubscription: false });
    }
  }, [isSignedIn]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).polar.checkSubscription();
      
      setStatus(response);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Failed to check subscription status');
      setStatus({ hasActiveSubscription: false });
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (isSignedIn) {
      checkSubscription();
    }
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
