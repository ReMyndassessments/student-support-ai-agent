import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface TeacherLoginProps {
  onLoginSuccess: (user: { email: string; name: string; isAdmin: boolean }) => void;
}

export function TeacherLogin({ onLoginSuccess }: TeacherLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await backend.auth.teacherLogin({ email, password });
      
      if (response.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`
        });
        onLoginSuccess(response.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-6">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Teacher Login
            </span>
          </h1>
          <p className="text-gray-600">
            Sign in to access Concern2Care
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              Teacher Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                  className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoggingIn}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 pr-10"
                    disabled={isLoggingIn}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    disabled={isLoggingIn}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn || !email.trim() || !password.trim()}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <Alert className="mt-6 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <User className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Demo Environment</strong>
                <br />
                Use any email ending in ".demo" with password "demo" to test teacher login.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-semibold text-emerald-900 mb-3">Demo Teacher Accounts:</h3>
            <div className="space-y-2 text-emerald-800 text-sm">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono">teacher@school.demo</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="font-mono">demo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
