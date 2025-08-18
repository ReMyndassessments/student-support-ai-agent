import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';
import type { AccessResponse } from '~backend/users/check-access';

export function useSubscription() {
  const [status, setStatus] = useState<AccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      checkSubscription();
    } else {
      setLoading(false);
      setStatus({ hasAccess: false });
    }
  }, [isSignedIn]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).users.checkAccess();
      
      setStatus(response);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Failed to check subscription status');
      setStatus({ hasAccess: false });
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
    hasActiveSubscription: status?.hasAccess || false,
    planType: status?.planType
  };
}
