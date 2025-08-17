import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Crown, Calendar, AlertTriangle, CheckCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { SubscriptionStatus as Status } from '~backend/polar/check-subscription';

interface SubscriptionStatusProps {
  userEmail: string;
}

export function SubscriptionStatus({ userEmail }: SubscriptionStatusProps) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      checkSubscription();
    }
  }, [userEmail]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      const response = await backend.polar.checkSubscription({ email: userEmail });
      setStatus(response);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (statusValue?: string) => {
    switch (statusValue) {
      case 'active':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanIcon = (planType?: string) => {
    switch (planType?.toLowerCase()) {
      case 'teacher':
        return '👨‍🏫';
      case 'school':
        return '🏫';
      case 'district':
        return '🏛️';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-gray-600">Checking subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status?.hasActiveSubscription) {
    return (
      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>No active subscription found.</strong>
              <br />
              Subscribe to unlock all premium features.
            </div>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl ml-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <Crown className="h-6 w-6" />
          </div>
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPlanIcon(status.planType)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {status.planType?.charAt(0).toUpperCase() + status.planType?.slice(1)} Plan
                </h3>
                <Badge className={`${getStatusColor(status.status)} rounded-xl px-3 py-1 font-medium`}>
                  {status.status?.charAt(0).toUpperCase() + status.status?.slice(1)}
                </Badge>
              </div>
            </div>

            <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>Subscription Active!</strong>
                <br />
                You have full access to all premium features.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-4">
            {status.currentPeriodEnd && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Next Billing</span>
                </div>
                <p className="text-gray-600">{formatDate(status.currentPeriodEnd)}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={checkSubscription}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Refresh Status
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
              >
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Access */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Your Plan Includes:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Unlimited student referrals',
              'AI-powered recommendations',
              'PDF report generation',
              'Email sharing capabilities',
              'Follow-up assistance',
              status.planType !== 'teacher' ? 'Multi-teacher collaboration' : 'Basic analytics',
              status.planType === 'district' ? 'Advanced analytics' : null,
              status.planType === 'district' ? 'Custom integrations' : null
            ].filter(Boolean).map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
