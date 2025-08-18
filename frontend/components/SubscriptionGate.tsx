import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, Mail, Sparkles, AlertTriangle, Shield, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionGateProps {
  userEmail: string;
  children: ReactNode;
  feature?: string;
}

export function SubscriptionGate({ userEmail, children, feature = "this feature" }: SubscriptionGateProps) {
  const { hasActiveSubscription, loading } = useSubscription(userEmail);

  const handleDemoRequest = () => {
    try {
      const subject = encodeURIComponent('Demo Request for Concern2Care');
      const body = encodeURIComponent(`Hello,

I would like to request a demo of Concern2Care.

Please contact me to schedule a demonstration.

Thank you!`);
      
      const mailtoUrl = `mailto:c2c_demo@remynd.online?subject=${subject}&body=${body}`;
      console.log('Opening demo request email:', mailtoUrl);
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      console.error('Error opening email client:', error);
      // Fallback
      navigator.clipboard?.writeText('c2c_demo@remynd.online').then(() => {
        alert('Demo email address copied to clipboard: c2c_demo@remynd.online');
      }).catch(() => {
        alert('Please email c2c_demo@remynd.online for a demo request');
      });
    }
  };

  const handleContactSales = () => {
    try {
      const subject = encodeURIComponent('Teacher Subscription Request for Concern2Care');
      const body = encodeURIComponent(`Hello,

I would like to subscribe to Concern2Care as a teacher to access ${feature}.

Please contact me with:
- Subscription details and pricing
- Payment methods
- Setup instructions

Thank you!`);
      
      const mailtoUrl = `mailto:sales@remynd.online?subject=${subject}&body=${body}`;
      console.log('Opening sales contact email:', mailtoUrl);
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      console.error('Error opening email client:', error);
      // Fallback
      navigator.clipboard?.writeText('sales@remynd.online').then(() => {
        alert('Sales email address copied to clipboard: sales@remynd.online');
      }).catch(() => {
        alert('Please email sales@remynd.online for subscription information');
      });
    }
  };

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

          {/* Payment Notice */}
          <Alert className="max-w-4xl mx-auto mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Direct Contact for Subscriptions</strong>
              <br />
              We're currently setting up automated payments. Contact us directly for secure payment options and quick setup!
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

                  <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 text-sm">
                      <strong>Why a Personal Subscription?</strong>
                      <br />
                      • Protects student data privacy and ensures FERPA compliance
                      <br />
                      • Provides AI recommendations tailored to your teaching style
                      <br />
                      • Prevents unauthorized access to sensitive information
                      <br />
                      • Gives you full control over your professional tools
                    </AlertDescription>
                  </Alert>
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
                    <Button
                      onClick={handleContactSales}
                      className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Sales for Subscription
                    </Button>
                    
                    <Button
                      onClick={handleDemoRequest}
                      variant="outline"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 rounded-2xl py-3"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Request Demo First
                    </Button>

                    <Link to="/subscription/plans">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl py-3"
                      >
                        View Pricing Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">
                Ready to Get Started?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-3">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 mb-2">Teacher Subscriptions</h4>
                  <p className="text-emerald-700 text-sm mb-3">Get pricing and payment options</p>
                  <button 
                    onClick={() => window.open('mailto:sales@remynd.online', '_blank')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                  >
                    sales@remynd.online
                  </button>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 mb-2">Demos & Questions</h4>
                  <p className="text-emerald-700 text-sm mb-3">See the platform in action</p>
                  <button 
                    onClick={() => window.open('mailto:c2c_demo@remynd.online', '_blank')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                  >
                    c2c_demo@remynd.online
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-emerald-800 text-sm">
                  <strong>Quick Setup:</strong> We typically respond within 24 hours and can activate your account within 1-2 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
