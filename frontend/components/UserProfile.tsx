import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Key, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';
import type { UserProfile as Profile } from '~backend/users/get-profile';

export function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    deepSeekApiKey: ''
  });
  const { toast } = useToast();
  const { getToken, user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).users.getProfile();
      
      setProfile(response);
      setFormData({
        name: response.name || '',
        deepSeekApiKey: ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).users.updateProfile({
        name: formData.name || undefined,
        deepSeekApiKey: formData.deepSeekApiKey || undefined
      });
      
      setProfile(response);
      setFormData(prev => ({ ...prev, deepSeekApiKey: '' }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={user?.emailAddresses?.[0]?.emailAddress || ''}
                  disabled
                  className="border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {profile && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                    <span className="font-medium text-gray-700">Member Since:</span>
                    <p className="text-gray-600">{formatDate(profile.createdAt)}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl">
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">{formatDate(profile.updatedAt)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DeepSeek API Key */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Key className="h-6 w-6" />
            </div>
            DeepSeek API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">API Key Status</h3>
              <p className="text-gray-600 text-sm">Required for AI-powered recommendations</p>
            </div>
            <Badge className={profile?.hasDeepSeekApiKey 
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200" 
              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200"
            }>
              {profile?.hasDeepSeekApiKey ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Not Set
                </>
              )}
            </Badge>
          </div>

          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Why do I need a personal DeepSeek API key?</strong>
              <br />
              Your personal API key ensures you have direct access to AI recommendations, maintains data privacy, 
              and helps us keep costs sustainable. You can get a free API key from DeepSeek that includes generous usage limits.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepSeekApiKey" className="text-sm font-medium text-gray-700">
                DeepSeek API Key
              </Label>
              <div className="relative">
                <Input
                  id="deepSeekApiKey"
                  type={showApiKey ? "text" : "password"}
                  value={formData.deepSeekApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, deepSeekApiKey: e.target.value }))}
                  placeholder={profile?.hasDeepSeekApiKey ? "Enter new API key to update" : "Enter your DeepSeek API key"}
                  className="border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-2">How to get your DeepSeek API key:</h4>
              <ol className="text-amber-800 text-sm space-y-1 list-decimal list-inside">
                <li>Visit the DeepSeek platform and create an account</li>
                <li>Navigate to the API section in your dashboard</li>
                <li>Generate a new API key</li>
                <li>Copy and paste it here</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl"
                onClick={() => window.open('https://platform.deepseek.com/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get DeepSeek API Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-3 px-8 transform hover:scale-105 transition-all duration-200"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
