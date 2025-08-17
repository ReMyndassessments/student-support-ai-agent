import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Brain, Shield, CreditCard, Mail } from 'lucide-react';

interface LandingPageProps {
  userEmail?: string;
}

export function LandingPage({ userEmail = "teacher@school.edu" }: LandingPageProps) {
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
    const subject = encodeURIComponent('Demo Request for Concern2Care');
    const body = encodeURIComponent(`Hello,

I would like to request a demo of Concern2Care for my school/district.

Please contact me to schedule a demonstration.

Thank you!`);
    
    window.location.href = `mailto:c2c_demo@remynd.online?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
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
                Concern2Care
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-2 font-medium">
              Stronger Tools for Teachers. Smarter Support for Students.
            </p>
            <p className="text-sm text-gray-500 font-medium">
              from Remynd
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-16">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Get instant AI-powered strategies for academic, behavioral, and social-emotional needs
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Plus professional reports and streamlined communication with your school's support team. With Concern2Care, you can quickly capture a concern and receive research-based, ready-to-use interventions that help your students succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/subscription/plans">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Subscribe Now
                  </Button>
                </Link>
                <Button 
                  onClick={handleDemoRequest}
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-2xl py-6 px-8 text-lg font-semibold"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
                <Link to="/subscription/plans">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-2xl py-6 px-8 text-lg font-semibold">
                    View Plans & Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Concern2Care?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for educators to streamline student support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-3xl overflow-hidden`}>
                <CardContent className="p-8 text-center relative">
                  {/* Decorative background */}
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

        {/* What You Get */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg mb-4`}>
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform translate-x-4 z-0"></div>
                )}
                
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg text-white font-bold text-xl mb-4 relative z-10`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Student Support?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of educators using AI-powered tools to better support their students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/subscription/plans">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Subscribe Now
                  </Button>
                </Link>
                <Button 
                  onClick={handleDemoRequest}
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-2xl py-6 px-8 text-lg font-semibold"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
                <Link to="/subscription/plans">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-2xl py-6 px-8 text-lg font-semibold">
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
