import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, Users, Building, GraduationCap, ArrowRight, Sparkles, Mail, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';

interface Plan {
  id: 'teacher' | 'school' | 'district';
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgGradient: string;
}

const plans: Plan[] = [
  {
    id: 'teacher',
    name: 'Teacher Plan',
    price: '$15/month',
    description: 'Perfect for individual teachers',
    features: [
      'Unlimited student referrals',
      'AI-powered recommendations',
      'PDF report generation',
      'Email sharing',
      'Follow-up assistance',
      'Personal API key integration',
      'Basic analytics'
    ],
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  {
    id: 'school',
    name: 'School Plan',
    price: '$125/month',
    description: 'For schools with collaboration features',
    features: [
      'Everything in Teacher Plan',
      'Multi-teacher collaboration',
      'School-wide analytics',
      'Admin dashboard',
      'Priority support',
      'Custom branding',
      'Data export tools',
      'Bulk user management'
    ],
    icon: Building,
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  {
    id: 'district',
    name: 'District Plan',
    price: '$1,250/month',
    description: 'For school districts and large organizations',
    features: [
      'Everything in School Plan',
      'District-wide deployment',
      'Advanced analytics & reporting',
      'Custom integrations',
      'Dedicated account manager',
      'Training & onboarding',
      'SLA guarantee',
      'White-label options',
      'Enterprise security'
    ],
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  }
];

export function SubscriptionPlans() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [configurationError, setConfigurationError] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, getToken } = useAuth();

  const handleSubscribe = async (planType: 'teacher' | 'school' | 'district') => {
    if (!isSignedIn) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCheckout(true);
    setConfigurationError(false);
    
    try {
      // Get the authentication token
      const token = await getToken();
      
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).polar.createCheckout({
        planType,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/plans`
      });

      // Redirect to Polar checkout
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      
      // Check if it's a configuration error
      if (error instanceof Error && (
        error.message.includes('not configured') ||
        error.message.includes('Product ID not configured') ||
        error.message.includes('API key not configured')
      )) {
        setConfigurationError(true);
        toast({
          title: "Payment System Setup",
          description: "Payment processing is being configured. Please use the contact options below.",
          variant: "destructive"
        });
      } else if (error instanceof Error && error.message.includes('unauthenticated')) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe to a plan.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again or contact support.",
          variant: "destructive"
        });
      }
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleDemoRequest = () => {
    const subject = encodeURIComponent('Demo Request for Concern2Care');
    const body = encodeURIComponent(`Hello,

I would like to request a demo of Concern2Care for my school/district.

Please contact me to schedule a demonstration.

Thank you!`);
    
    window.location.href = `mailto:c2c_demo@remynd.online?subject=${subject}&body=${body}`;
  };

  const handleDirectContact = (planType: 'teacher' | 'school' | 'district') => {
    const plan = plans.find(p => p.id === planType);
    const subject = encodeURIComponent(`Subscription Request - ${plan?.name}`);
    const body = encodeURIComponent(`Hello,

I would like to subscribe to the ${plan?.name} for Concern2Care.

Plan: ${plan?.name} (${plan?.price})

Please contact me to complete the subscription setup.

Thank you!`);
    
    window.location.href = `mailto:sales@remynd.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="hidden sm:block absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="hidden sm:block absolute top-10 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="hidden sm:block absolute -top-5 right-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-20 animate-pulse delay-500"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 font-medium">
              Unlock the full power of AI-driven student support
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Professional tools for better student outcomes
            </p>
          </div>
        </div>

        {/* Individual Account Notice */}
        <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
          <Shield className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm sm:text-base">
            <strong>Individual Account Required</strong>
            <br />
            Each teacher needs their own personal subscription to ensure secure access, data privacy compliance, 
            and personalized AI recommendations. This prevents account sharing and protects student data.
          </AlertDescription>
        </Alert>

        {/* Configuration Error Alert */}
        {configurationError && (
          <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm sm:text-base">
              <strong>Payment System Configuration</strong>
              <br />
              Our payment system is currently being set up. In the meantime, please contact us directly to set up your subscription. 
              We'll have automated payments available soon!
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Request Option */}
        <Card className="max-w-2xl mx-auto mb-8 sm:mb-12 border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-lg mb-3 sm:mb-4">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Want to See It in Action?
            </h3>
            <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Schedule a personalized demo to see how Concern2Care can transform your student support process. Perfect for schools and districts evaluating the platform.
            </p>
            <Button
              onClick={handleDemoRequest}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
            >
              <Mail className="mr-2 h-5 w-5" />
              Request Demo
            </Button>
          </CardContent>
        </Card>

        {/* Authentication Notice */}
        {!isSignedIn && (
          <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <Shield className="h-5 w-5 text-purple-600" />
            <AlertDescription className="text-purple-800 text-sm sm:text-base">
              <strong>Sign In Required</strong>
              <br />
              Please sign in to subscribe to a plan. This ensures your subscription is tied to your personal account for security and data privacy.
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className="relative border-0 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-2xl sm:rounded-3xl overflow-hidden touch-manipulation active:scale-95"
              >
                <CardHeader className={`bg-gradient-to-r ${plan.gradient} text-white rounded-t-2xl sm:rounded-t-3xl pt-4 sm:pt-6`}>
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl shadow-lg`}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                      <p className="text-white/80 mt-2 text-sm sm:text-base">{plan.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold">{plan.price}</div>
                      <p className="text-white/80 text-xs sm:text-sm">Per individual teacher</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCreatingCheckout || !isSignedIn}
                      className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg rounded-xl sm:rounded-2xl py-4 sm:py-6 text-sm sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation`}
                    >
                      {isCreatingCheckout ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          Creating Checkout...
                        </>
                      ) : !isSignedIn ? (
                        <>
                          Sign In to Subscribe
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      )}
                    </Button>
                    
                    {configurationError && (
                      <Button
                        onClick={() => handleDirectContact(plan.id)}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl sm:rounded-2xl py-2 sm:py-3 text-sm touch-manipulation active:scale-95"
                      >
                        <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Contact for Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose Concern2Care?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your student support process with AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered',
              description: 'Get intelligent Tier 2 intervention recommendations tailored to each student\'s specific needs.',
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Individual accounts ensure data privacy compliance and prevent unauthorized access to student information.',
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50'
            },
            {
              icon: Building,
              title: 'Scalable',
              description: 'From individual teachers to entire districts, our platform grows with your organization while maintaining security.',
              gradient: 'from-emerald-500 to-teal-500',
              bgGradient: 'from-emerald-50 to-teal-50'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-2xl sm:rounded-3xl overflow-hidden touch-manipulation active:scale-95`}>
                <CardContent className="p-6 sm:p-8 text-center relative">
                  <div className="absolute inset-0 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${feature.gradient}`}></div>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 relative z-10`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {[
              {
                question: "Why does each teacher need their own subscription?",
                answer: "Individual subscriptions ensure data privacy compliance, prevent unauthorized access to student information, and provide personalized AI recommendations based on each teacher's specific needs and teaching style."
              },
              {
                question: "Can schools purchase subscriptions for their teachers?",
                answer: "Yes! Schools can purchase individual subscriptions for their teachers. School and District plans include bulk management features and administrative controls while maintaining individual account security."
              },
              {
                question: "How does billing work?",
                answer: "All plans are billed monthly through Polar. You can upgrade, downgrade, or cancel your subscription at any time through your account dashboard."
              },
              {
                question: "Is my student data secure?",
                answer: "Absolutely. We follow FERPA guidelines and use enterprise-grade security to protect all student information. Individual accounts prevent data sharing between unauthorized users."
              },
              {
                question: "Do you offer training and support?",
                answer: "Yes! School and District plans include training sessions and priority support. Teacher plans have access to our help center and email support."
              },
              {
                question: "What if I need to cancel?",
                answer: "You can cancel your subscription at any time through the Polar customer portal. You'll continue to have access until the end of your current billing period."
              },
              {
                question: "Can I see a demo before subscribing?",
                answer: "Absolutely! Click the 'Request Demo' button to schedule a personalized demonstration of Concern2Care for your school or district."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl sm:rounded-2xl text-left touch-manipulation active:scale-95 transition-transform">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.question}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-12 sm:mt-16">
          <Alert className="max-w-2xl mx-auto border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <AlertDescription className="text-blue-800 text-sm sm:text-base">
              <strong>Need a custom solution?</strong> Contact us for enterprise pricing and custom integrations for large districts.
              <br />
              <a href="mailto:sales@remynd.com" className="text-blue-600 hover:text-blue-700 font-medium">
                sales@remynd.com
              </a>
              <br />
              <strong>Want a demo?</strong> Email us at{' '}
              <a href="mailto:c2c_demo@remynd.online" className="text-blue-600 hover:text-blue-700 font-medium">
                c2c_demo@remynd.online
              </a>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
