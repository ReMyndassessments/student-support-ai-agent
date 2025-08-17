import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, List, ArrowRight, Plus, Eye, Sparkles, Users, Brain, Shield, BookOpen } from 'lucide-react';

export function LandingPage() {
  const quickActions = [
    {
      to: '/new-referral',
      icon: Plus,
      title: 'New Referral',
      description: 'Submit a new student concern',
      gradient: 'from-blue-500 via-blue-600 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    {
      to: '/referrals',
      icon: Eye,
      title: 'View Referrals',
      description: 'Review submitted referrals',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      bgGradient: 'from-emerald-50 to-cyan-50'
    },
    {
      to: '/resources',
      icon: BookOpen,
      title: 'Resource Library',
      description: 'Browse intervention templates',
      gradient: 'from-purple-500 via-pink-500 to-rose-600',
      bgGradient: 'from-purple-50 to-rose-50'
    }
  ];

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
              AI-Powered Student Support System
            </p>
            <p className="text-sm text-gray-500 font-medium">
              from Remynd
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to} to={action.to} className="group">
                <Card className={`h-full border-0 bg-gradient-to-br ${action.bgGradient} hover:shadow-2xl transition-all duration-300 group-hover:scale-105 transform rounded-3xl overflow-hidden`}>
                  <CardContent className="p-8 text-center relative">
                    {/* Decorative background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <div className={`w-full h-full bg-gradient-to-br ${action.gradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
                    </div>
                    
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      {action.description}
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
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

        {/* Process Steps */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Submit',
                description: 'Fill out student concern form',
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'AI generates recommendations',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: 'Access',
                description: 'Browse resource library',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                step: '4',
                title: 'Implement',
                description: 'Apply with support team',
                gradient: 'from-rose-500 to-orange-500'
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Connection line */}
                {index < 3 && (
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
      </div>
    </div>
  );
}
