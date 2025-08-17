import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, List, ArrowRight, Plus, Eye } from 'lucide-react';

export function LandingPage() {
  const quickActions = [
    {
      to: '/new-referral',
      icon: Plus,
      title: 'New Referral',
      description: 'Submit a new student concern',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      to: '/referrals',
      icon: Eye,
      title: 'View Referrals',
      description: 'Review submitted referrals',
      color: 'bg-emerald-600 hover:bg-emerald-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Concern2Care
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            AI-Powered Student Support Referral System
          </p>
          <p className="text-sm text-gray-500">
            from Remynd
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to} to={action.to} className="group">
                <Card className="h-full border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${action.color} rounded-lg mb-4 transition-colors`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {action.description}
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Submit',
                description: 'Fill out student concern form'
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'AI generates recommendations'
              },
              {
                step: '3',
                title: 'Review',
                description: 'Implement with support team'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 font-medium mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
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
