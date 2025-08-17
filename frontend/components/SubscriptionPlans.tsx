import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, Users, Building, GraduationCap, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
    description: 'For entire schools and departments',
    features: [
      'Everything in Teacher Plan',
      'Multi-teacher collaboration',
      'School-wide analytics',
      'Admin dashboard',
      'Priority support',
      'Custom branding',
      'Data export tools'
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
      'White-label options'
    ],
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50'
  }
];

export function SubscriptionPlans() {
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: ''
  });
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (planType: 'teacher' | 'school' | 'district') => {
    if (!customerInfo.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCheckout(true);
    try {
      const response = await backend.polar.createCheckout({
        customerEmail: customerInfo.email,
        customerName: customerInfo.name || undefined,
        planType,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/plans`
      });

      // Redirect to Polar checkout
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      
      // Check if it's a configuration error
      if (error instanceof Error && error.message.includes('Product ID not configured')) {
        toast({
          title: "Configuration Error",
          description: "Payment system is still being configured. Please contact us directly for subscription setup.",
          variant: "destructive"
        });
        
        // Fallback to email contact
        setTimeout(() => {
          const subject = encodeURIComponent(`Subscription Request - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`);
          const body = encodeURIComponent(`Hello,

I would like to subscribe to the ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan for Concern2Care.

Customer Information:
- Email: ${customerInfo.email}
- Name: ${customerInfo.name || 'Not provided'}
- Plan: ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan (${plans.find(p => p.id === planType)?.price})

Please contact me to complete the subscription setup.

Thank you!`);
          
          window.location.href = `mailto:sales@remynd.com?subject=${subject}&body=${body}`;
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-10 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute -top-5 right-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-20 animate-pulse delay-500"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-2 font-medium">
              Unlock the full power of AI-driven student support
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Professional tools for better student outcomes
            </p>
          </div>
        </div>

        {/* Demo Request Option */}
        <Card className="max-w-2xl mx-auto mb-12 border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-lg mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Want to See It in Action?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Schedule a personalized demo to see how Concern2Care can transform your student support process. Perfect for schools and districts evaluating the platform.
            </p>
            <Button
              onClick={handleDemoRequest}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg rounded-2xl py-3 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Mail className="mr-2 h-5 w-5" />
              Request Demo
            </Button>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="max-w-md mx-auto mb-12 border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-3xl">
            <CardTitle className="text-center text-xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@school.edu"
                className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name (optional)
              </Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                className="border-gray-200 rounded-xl focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className="relative border-0 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 transform rounded-3xl overflow-hidden"
              >
                <CardHeader className={`bg-gradient-to-r ${plan.gradient} text-white rounded-t-3xl pt-6`}>
                  <div className="text-center space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <p className="text-white/80 mt-2">{plan.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <p className="text-white/80 text-sm">Billed monthly</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCreatingCheckout || !customerInfo.email}
                    className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105`}
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Concern2Care?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your student support process with AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered',
              description: 'Get intelligent Tier 2 intervention recommendations tailored to each student\'s specific needs.',
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50'
            },
            {
              icon: Users,
              title: 'Collaborative',
              description: 'Share referrals with your support team and prepare comprehensive meeting documentation.',
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50'
            },
            {
              icon: Building,
              title: 'Scalable',
              description: 'From individual teachers to entire districts, our platform grows with your organization.',
              gradient: 'from-emerald-500 to-teal-500',
              bgGradient: 'from-emerald-50 to-teal-50'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-3xl overflow-hidden`}>
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${feature.gradient}`}></div>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg mb-4 relative z-10`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does billing work?",
                answer: "All plans are billed monthly. You can upgrade, downgrade, or cancel your subscription at any time through your account dashboard."
              },
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle."
              },
              {
                question: "Is my student data secure?",
                answer: "Absolutely. We follow FERPA guidelines and use enterprise-grade security to protect all student information."
              },
              {
                question: "Do you offer training and support?",
                answer: "Yes! School and District plans include training sessions and priority support. Teacher plans have access to our help center and email support."
              },
              {
                question: "What if I need to cancel?",
                answer: "You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
              },
              {
                question: "Can I see a demo before subscribing?",
                answer: "Absolutely! Click the 'Request Demo' button to schedule a personalized demonstration of Concern2Care for your school or district."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl text-left">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-16">
          <Alert className="max-w-2xl mx-auto border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <AlertDescription className="text-blue-800">
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
