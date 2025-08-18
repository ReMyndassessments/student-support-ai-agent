import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, Mail, Sparkles, AlertTriangle, Shield, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionGateProps {
  children: ReactNode;
  feature?: string;
}

export function SubscriptionGate({ children, feature = "this feature" }: SubscriptionGateProps) {
  const { hasActiveSubscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-600">Checking subscription status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-5 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl shadow-2xl mb-6">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Teacher Subscription Required
              </h1>
              <p className="text-gray-600 text-lg">
                Unlock {feature} with your personal Concern2Care subscription
              </p>
            </div>
          </div>

          {/* Individual Account Required */}
          <Alert className="max-w-4xl mx-auto mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Personal Teacher Account</strong>
              <br />
              Concern2Care is designed for individual teachers. Your personal subscription ensures secure access, 
              data privacy compliance, and AI recommendations tailored to your specific teaching style.
            </AlertDescription>
          </Alert>

          {/* Subscription Required Card */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-t-3xl">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                Teacher Plan - $15/month
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">What You'll Get:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">5 referrals per month included</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">AI-powered Tier 2 intervention recommendations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">PDF report generation for meetings</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">Email sharing with colleagues</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">Follow-up implementation assistance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">Personal DeepSeek API key integration</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 rounded-2xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Simple Teacher Pricing</h4>
                    <div className="bg-white/60 p-4 rounded-xl border-2 border-blue-300">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">$15</div>
                        <p className="text-gray-600 text-sm">per month</p>
                        <p className="text-gray-600 text-xs mt-1">Everything included</p>
                      </div>
                    </div>
                    <p className="text-purple-700 text-sm mt-3">
                      No complicated tiers or hidden fees. One simple plan with everything you need as a teacher.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link to="/subscription/plans">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        View Subscription Options
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
