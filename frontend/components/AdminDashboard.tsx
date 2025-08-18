import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, FileText, Sparkles, LogOut, User, Settings, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface AdminDashboardProps {
  user: { email: string; name: string; isAdmin: boolean };
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await backend.auth.adminLogout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const demoStats = [
    {
      title: 'Demo Features',
      value: '2',
      description: 'Core features for demonstration',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'AI Recommendations',
      value: 'Unlimited',
      description: 'Using admin DeepSeek API',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Demo Ready',
      value: 'Active',
      description: 'All systems operational',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  const adminTools = [
    {
      title: 'Manage Teachers',
      description: 'Add, edit, or remove teacher accounts from the system',
      icon: Users,
      href: '/admin/teachers',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Create Sample Support Request',
      description: 'Demonstrate the support request creation process with AI recommendations',
      icon: FileText,
      href: '/new-referral',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      title: 'View All Support Requests',
      description: 'Show existing support requests and management capabilities',
      icon: Users,
      href: '/referrals',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Demo Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 rounded-xl px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Demo Admin
            </Badge>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Logging Out...' : 'Logout'}
            </Button>
          </div>
        </div>

        {/* Demo Status */}
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
          <Shield className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Environment Active</strong>
            <br />
            You are logged in as the demo administrator. All AI features are fully functional with the admin DeepSeek API key.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-gray-600 text-sm">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Subscription & Usage */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              Subscription & Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Current Plan</h4>
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 rounded-xl px-4 py-2 text-base">
                  <Shield className="h-4 w-4 mr-2" />
                  Demo Admin Plan
                </Badge>
                <p className="text-xs text-gray-500">
                  This is a demonstration account with full access.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Monthly Usage</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                    style={{ width: `100%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Unlimited support requests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              Admin Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminTools.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="border-0 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-200 hover:scale-105 transform rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-2xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                          <Button
                            onClick={() => window.location.href = action.href}
                            className={`w-full bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white rounded-xl`}
                          >
                            Go
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Admin Info */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              Admin Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl">
                  <span className="font-medium text-gray-700">Role:</span>
                  <p className="text-gray-600">Demo Administrator</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl">
                  <span className="font-medium text-gray-700">API Access:</span>
                  <p className="text-gray-600">Admin DeepSeek API Key Active</p>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl">
                  <span className="font-medium text-gray-700">Session:</span>
                  <p className="text-gray-600">24 Hour Demo Access</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
