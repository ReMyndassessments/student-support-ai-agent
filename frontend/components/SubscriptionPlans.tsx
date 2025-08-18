import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Building, GraduationCap, ArrowRight, Sparkles, Mail, AlertTriangle, Shield, Phone, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const handleDemoRequest = () => {
    const subject = encodeURIComponent('Demo Request for Concern2Care');
    const body = encodeURIComponent(`Hello,

I would like to request a demo of Concern2Care for my school/district.

Please contact me to schedule a demonstration.

Thank you!`);
    
    window.location.href = `mailto:c2c_demo@remynd.online?subject=${subject}&body=${body}`;
  };

  const handleSubscriptionContact = (planType: 'teacher' | 'school' | 'district') => {
    const plan = plans.find(p => p.id === planType);
    const subject = encodeURIComponent(`Subscription Request - ${plan?.name}`);
    const body = encodeURIComponent(`Hello,

I would like to subscribe to the ${plan?.name} for Concern2Care.

Plan Details:
- Plan: ${plan?.name}
- Price: ${plan?.price}
- Description: ${plan?.description}

Please contact me to complete the subscription setup and provide payment instructions.

Thank you!`);
    
    window.location.href = `mailto:sales@remynd.com?subject=${subject}&body=${body}`;
  };

  const handleContactSales = () => {
    const subject = encodeURIComponent('Concern2Care Subscription Inquiry');
    const body = encodeURIComponent(`Hello,

I'm interested in subscribing to Concern2Care. Please contact me with:

- Available subscription options
- Payment methods
- Setup instructions
- Any current promotions

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

        {/* Payment System Notice */}
        <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm sm:text-base">
            <strong>Direct Contact for Subscriptions</strong>
            <br />
            We're currently setting up automated payments. In the meantime, please contact us directly to set up your subscription. 
            We'll provide secure payment options and get you started quickly!
          </AlertDescription>
        </Alert>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl shadow-lg mb-3 sm:mb-4">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Ready to Subscribe?
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Contact our sales team to set up your subscription with secure payment options.
              </p>
              <Button
                onClick={handleContactSales}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-lg mb-3 sm:mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Want to See It First?
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Schedule a personalized demo to see how Concern2Care can transform your student support process.
              </p>
              <Button
                onClick={handleDemoRequest}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Request Demo
              </Button>
            </CardContent>
          </Card>
        </div>

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
                          <div className="h-2 w-2 sm:h-3 sm:w-3 bg-white rounded-full" />
                        </div>
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => handleSubscriptionContact(plan.id)}
                      className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg rounded-xl sm:rounded-2xl py-4 sm:py-6 text-sm sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation`}
                    >
                      Contact for {plan.name}
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card className="max-w-4xl mx-auto border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Sales & Subscriptions</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:sales@remynd.com" className="text-blue-600 hover:text-blue-700 text-sm">
                        sales@remynd.com
                      </a>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-emerald-800 text-sm">
                      <strong>Response Time:</strong> We typically respond within 24 hours with subscription details and secure payment options.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Demos & Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Demo Requests</p>
                      <a href="mailto:c2c_demo@remynd.online" className="text-amber-600 hover:text-amber-700 text-sm">
                        c2c_demo@remynd.online
                      </a>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-purple-800 text-sm">
                      <strong>Demo Scheduling:</strong> Perfect for schools and districts evaluating the platform. We'll customize the demo to your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">What to Include in Your Email:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li>• Your name and school/district</li>
                    <li>• Preferred plan type</li>
                    <li>• Number of teachers (if applicable)</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Timeline for implementation</li>
                    <li>• Any specific questions</li>
                    <li>• Preferred contact method</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                question: "How do I subscribe without automated payments?",
                answer: "Simply contact our sales team at sales@remynd.com with your preferred plan. We'll provide secure payment options including bank transfer, check, or credit card processing through our secure portal."
              },
              {
                question: "Why does each teacher need their own subscription?",
                answer: "Individual subscriptions ensure data privacy compliance, prevent unauthorized access to student information, and provide personalized AI recommendations based on each teacher's specific needs and teaching style."
              },
              {
                question: "Can schools purchase subscriptions for their teachers?",
                answer: "Yes! Schools can purchase individual subscriptions for their teachers. School and District plans include bulk management features and administrative controls while maintaining individual account security."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept bank transfers, checks, and credit card payments through our secure payment portal. Our sales team will provide detailed payment instructions based on your preference."
              },
              {
                question: "How quickly can I get started?",
                answer: "Once payment is processed, we can activate your account within 24 hours. We'll provide setup instructions and help you get started with your first referrals."
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
                question: "Can I see a demo before subscribing?",
                answer: "Absolutely! Email c2c_demo@remynd.online to schedule a personalized demonstration of Concern2Care for your school or district."
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

        {/* Final CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
                Contact us today to set up your Concern2Care subscription and start transforming your student support process.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
                <Button
                  onClick={handleContactSales}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Sales Team
                </Button>
                <Button
                  onClick={handleDemoRequest}
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
