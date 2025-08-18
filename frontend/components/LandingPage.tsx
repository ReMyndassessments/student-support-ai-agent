import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Brain, Shield, CreditCard, Mail } from 'lucide-react';
import { AdminLoginFooter } from './AdminLoginFooter';

interface LandingPageProps {
  userEmail?: string;
  onAdminLogin?: (user: { email: string; name: string; isAdmin: boolean }) => void;
}

export function LandingPage({ userEmail = "teacher@school.edu", onAdminLogin }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Smart intervention recommendations',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: Users,
      title: 'Teacher-Friendly',
      description: 'Simple, intuitive interface',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      icon: Shield,
      title: 'Professional',
      description: 'Meets educational standards',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  const handleDemoRequest = () => {
    try {
      const subject = encodeURIComponent('Demo Request for Concern2Care');
      const body = encodeURIComponent(`Hello,

I would like to request a demo of Concern2Care for my school/district.

Please contact me to schedule a demonstration.

Thank you!`);
      
      const mailtoUrl = `mailto:c2c_demo@remynd.online?subject=${subject}&body=${body}`;
      console.log('Opening demo request email:', mailtoUrl);
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      console.error('Error opening email client:', error);
      // Fallback: copy email to clipboard or show email address
      navigator.clipboard?.writeText('c2c_demo@remynd.online').then(() => {
        alert('Demo email address copied to clipboard: c2c_demo@remynd.online');
      }).catch(() => {
        alert('Please email c2c_demo@remynd.online for a demo request');
      });
    }
  };

  const handleContactSales = () => {
    try {
      const subject = encodeURIComponent('Subscription Inquiry for Concern2Care');
      const body = encodeURIComponent(`Hello,

I'm interested in subscribing to Concern2Care. Please contact me with:

- Subscription details and pricing
- Payment methods
- Setup instructions

Thank you!`);
      
      const mailtoUrl = `mailto:sales@remynd.com?subject=${subject}&body=${body}`;
      console.log('Opening sales contact email:', mailtoUrl);
      window.open(mailtoUrl, '_blank');
    } catch (error) {
      console.error('Error opening email client:', error);
      // Fallback: copy email to clipboard or show email address
      navigator.clipboard?.writeText('sales@remynd.com').then(() => {
        alert('Sales email address copied to clipboard: sales@remynd.com');
      }).catch(() => {
        alert('Please email sales@remynd.com for subscription information');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
                Concern2Care
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 font-medium px-4">
              Stronger Tools for Teachers. Smarter Support for Students.
            </p>
            <p className="text-sm text-gray-500 font-medium">
              from Remynd
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-12 sm:mb-16">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Get instant AI-powered strategies for academic, behavioral, and social-emotional needs
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Plus professional reports and streamlined communication with your school's support team. With Concern2Care, you can quickly capture a concern and receive research-based, ready-to-use interventions that help your students succeed.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
                <Button 
                  onClick={handleContactSales}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
                <Button 
                  onClick={handleDemoRequest}
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
                <Link to="/subscription/plans">
                  <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95">
                    View Plans & Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose Concern2Care?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for educators to streamline student support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-2xl sm:rounded-3xl overflow-hidden touch-manipulation active:scale-95`}>
                <CardContent className="p-6 sm:p-8 text-center relative">
                  {/* Decorative background */}
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

        {/* What You Get */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Research-Based Interventions',
                description: 'Get evidence-based strategies tailored to each student\'s specific academic, behavioral, and social-emotional needs.',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                title: 'Professional Documentation',
                description: 'Generate comprehensive PDF reports and share them with your support team for effective meetings.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Streamlined Communication',
                description: 'Simple referral forms, organized case management, and seamless collaboration with your school\'s support team.',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Ready-to-Use Strategies',
                description: 'Get detailed guidance on how to implement recommended interventions in your classroom immediately.',
                gradient: 'from-emerald-500 to-teal-500'
              }
            ].map((item, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-95">
                <CardContent className="p-4 sm:p-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4`}>
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '1',
                title: 'Capture',
                description: 'Quickly document student concerns',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'AI generates research-based strategies',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: 'Implement',
                description: 'Apply ready-to-use interventions',
                gradient: 'from-pink-500 to-rose-500'
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Connection line - hidden on mobile */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform translate-x-4 z-0"></div>
                )}
                
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl shadow-lg text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4 relative z-10 touch-manipulation active:scale-95 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Transform Student Support?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of educators using AI-powered tools to better support their students.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
                <Button 
                  onClick={handleContactSales}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
                <Button 
                  onClick={handleDemoRequest}
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
                <Link to="/subscription/plans">
                  <Button variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95">
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Login Footer */}
      {onAdminLogin && <AdminLoginFooter onAdminLogin={onAdminLogin} />}
    </div>
  );
}
