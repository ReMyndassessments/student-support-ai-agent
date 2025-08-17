import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, List, Sparkles, Users, Brain, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get intelligent Tier 2 intervention suggestions tailored to each student\'s specific needs.'
    },
    {
      icon: Users,
      title: 'Teacher-Friendly',
      description: 'Simple, intuitive forms designed by educators for educators.'
    },
    {
      icon: Shield,
      title: 'Professional Standards',
      description: 'All recommendations include proper disclaimers and guidance for professional review.'
    }
  ];

  const quickActions = [
    {
      to: '/new-referral',
      icon: FileText,
      title: 'New Referral',
      description: 'Submit a new student concern form',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      to: '/referrals',
      icon: List,
      title: 'View Referrals',
      description: 'Review submitted referrals and recommendations',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Concern<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">2</span>Care
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                AI-Powered Student Support Referral System
              </p>
              <p className="text-sm text-gray-500 font-medium">
                from Remynd
              </p>
            </div>

            {/* Subtitle */}
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl sm:text-2xl text-gray-700 font-medium">
                Transform student concerns into actionable Tier 2 interventions
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Streamline your student support process with intelligent recommendations that help teachers provide targeted interventions for students who may need 504/IEP accommodations.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/new-referral">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose an action to get started with student support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to} to={action.to} className="group">
                <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-3xl shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Concern2Care?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for educators to streamline student support processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to get AI-powered intervention recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Submit Concern',
              description: 'Fill out a quick form with student information and concern details'
            },
            {
              step: '2',
              title: 'AI Analysis',
              description: 'Our AI analyzes the concern and generates targeted Tier 2 intervention recommendations'
            },
            {
              step: '3',
              title: 'Review & Implement',
              description: 'Review recommendations with your student support team and implement appropriate interventions'
            }
          ].map((item, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg text-white font-bold text-xl">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
              {index < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform translate-x-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Concern2Care</h3>
            </div>
            <p className="text-gray-300">
              Empowering educators with AI-driven student support solutions
            </p>
            <p className="text-sm text-gray-400">
              © 2024 Remynd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
