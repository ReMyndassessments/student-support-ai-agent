import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubscriptionSuccess() {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                ['from-blue-400 to-purple-500', 'from-purple-400 to-pink-500', 'from-pink-400 to-rose-500', 'from-emerald-400 to-teal-500'][Math.floor(Math.random() * 4)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-5 right-1/3 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full shadow-2xl mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome to Concern2Care!
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-2 font-medium">
              Your subscription is now active
            </p>
            <p className="text-sm text-gray-500">
              Start transforming your student support process today
            </p>
          </div>
        </div>

        {/* Success Card */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-12">
          <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-7 w-7" />
              </div>
              Subscription Activated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What's Next?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">Your subscription is now active</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">All premium features are now unlocked</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">You'll receive a confirmation email shortly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">Set up your DeepSeek API key to enable AI features</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Need Help Getting Started?</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Check out our quick start guide or contact our support team for assistance.
                  </p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl">
                    View Help Center
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Actions</h3>
                
                <Link to="/profile" className="block">
                  <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-200 hover:scale-105 transform rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Set Up API Key</h4>
                          <p className="text-gray-600 text-sm">Configure your DeepSeek API key for AI features</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/new-referral" className="block">
                  <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-200 hover:scale-105 transform rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Create Your First Referral</h4>
                          <p className="text-gray-600 text-sm">Start using AI-powered recommendations</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/referrals" className="block">
                  <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-all duration-200 hover:scale-105 transform rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">View All Referrals</h4>
                          <p className="text-gray-600 text-sm">Manage your student support cases</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <div className="text-center">
          <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Questions or Need Support?
              </h3>
              <p className="text-amber-800 mb-4">
                Our team is here to help you get the most out of Concern2Care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl">
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
