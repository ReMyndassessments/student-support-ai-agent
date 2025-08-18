import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Key, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertTriangle, GraduationCap, School, Calendar, Plus, X, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';
import type { UserProfile as Profile } from '~backend/users/get-profile';

const GRADE_OPTIONS = [
  'Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th', '6th', 
  '7th', '8th', '9th', '10th', '11th', '12th', 'Mixed Grades'
];

const SUBJECT_OPTIONS = [
  'General Education', 'Mathematics', 'English/Language Arts', 'Science', 'Social Studies',
  'Physical Education', 'Art', 'Music', 'Library/Media', 'Special Education',
  'ESL/ELL', 'Reading Specialist', 'Counseling', 'Administration', 'Other'
];

const TEACHER_TYPES = [
  { value: 'classroom', label: 'Classroom Teacher' },
  { value: 'specialist', label: 'Specialist (Art, Music, PE, etc.)' },
  { value: 'support', label: 'Support Staff (Counselor, Special Ed, etc.)' }
];

export function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    schoolDistrict: '',
    primaryGrade: '',
    primarySubject: '',
    classId: '',
    additionalGrades: [] as string[],
    additionalSubjects: [] as string[],
    teacherType: 'classroom',
    schoolYear: '',
    deepSeekApiKey: ''
  });
  const [packagesToPurchase, setPackagesToPurchase] = useState(1);
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
        schoolName: response.schoolName || '',
        schoolDistrict: response.schoolDistrict || '',
        primaryGrade: response.primaryGrade || '',
        primarySubject: response.primarySubject || '',
        classId: response.classId || '',
        additionalGrades: response.additionalGrades || [],
        additionalSubjects: response.additionalSubjects || [],
        teacherType: response.teacherType || 'classroom',
        schoolYear: response.schoolYear || getCurrentSchoolYear(),
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

  const getCurrentSchoolYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // School year typically starts in August/September
    if (month >= 7) { // August or later
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
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
        schoolName: formData.schoolName || undefined,
        schoolDistrict: formData.schoolDistrict || undefined,
        primaryGrade: formData.primaryGrade || undefined,
        primarySubject: formData.primarySubject || undefined,
        classId: formData.classId || undefined,
        additionalGrades: formData.additionalGrades.length > 0 ? formData.additionalGrades : undefined,
        additionalSubjects: formData.additionalSubjects.length > 0 ? formData.additionalSubjects : undefined,
        teacherType: formData.teacherType || undefined,
        schoolYear: formData.schoolYear || undefined,
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

  const handlePurchasePackages = async () => {
    setPurchasing(true);
    try {
      const token = await getToken();
      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).users.purchaseSupportRequestPackage({
        packages: packagesToPurchase
      });
      
      if (response.success) {
        await loadProfile(); // Refresh profile to show new limits
        toast({
          title: "Packages Purchased",
          description: `Successfully purchased ${packagesToPurchase} support request package(s). Your new limit is ${response.newTotalLimit} support requests per month.`
        });
        setPackagesToPurchase(1);
      }
    } catch (error) {
      console.error('Error purchasing packages:', error);
      toast({
        title: "Error",
        description: "Failed to purchase support request packages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleAdditionalGradeChange = (grade: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalGrades: checked 
        ? [...prev.additionalGrades, grade]
        : prev.additionalGrades.filter(g => g !== grade)
    }));
  };

  const handleAdditionalSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalSubjects: checked 
        ? [...prev.additionalSubjects, subject]
        : prev.additionalSubjects.filter(s => s !== subject)
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSupportRequestUsageColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
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
      {/* Support Request Usage Status */}
      {profile && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              Monthly Support Request Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl ${getSupportRequestUsageColor(profile.supportRequestsUsedThisMonth, profile.supportRequestsLimit + (profile.additionalSupportRequestPackages * 10))}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Support Requests Used</span>
                    <Badge variant="outline" className="bg-white/60">
                      {profile.supportRequestsUsedThisMonth} / {profile.supportRequestsLimit + (profile.additionalSupportRequestPackages * 10)}
                    </Badge>
                  </div>
                  <div className="w-full bg-white/40 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((profile.supportRequestsUsedThisMonth / (profile.supportRequestsLimit + (profile.additionalSupportRequestPackages * 10))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <span className="font-medium text-blue-900">Base Limit:</span>
                    <p className="text-blue-700">{profile.supportRequestsLimit} support requests</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <span className="font-medium text-purple-900">Extra Packages:</span>
                    <p className="text-purple-700">{profile.additionalSupportRequestPackages} packages</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Need More Support Requests?</h4>
                <p className="text-gray-600 text-sm">
                  Purchase additional packages of 10 support requests each for $5 per package.
                </p>
                
                <div className="flex items-center gap-3">
                  <Select value={packagesToPurchase.toString()} onValueChange={(value) => setPackagesToPurchase(parseInt(value))}>
                    <SelectTrigger className="w-24 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">
                    package{packagesToPurchase > 1 ? 's' : ''} (${packagesToPurchase * 5})
                  </span>
                </div>

                <Button
                  onClick={handlePurchasePackages}
                  disabled={purchasing}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg rounded-xl"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Purchasing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Purchase Packages
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                value={user?.emailAddresses?.[0]?.emailAddress || ''}
                disabled
                className="border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed here. Use your account settings.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Information */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <School className="h-6 w-6" />
            </div>
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
                School Name
              </Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="Enter your school name"
                className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolDistrict" className="text-sm font-medium text-gray-700">
                School District
              </Label>
              <Input
                id="schoolDistrict"
                value={formData.schoolDistrict}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolDistrict: e.target.value }))}
                placeholder="Enter your school district"
                className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="teacherType" className="text-sm font-medium text-gray-700">
                Teacher Type
              </Label>
              <Select value={formData.teacherType} onValueChange={(value) => setFormData(prev => ({ ...prev, teacherType: value }))}>
                <SelectTrigger className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEACHER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId" className="text-sm font-medium text-gray-700">
                Class/Room ID
              </Label>
              <Input
                id="classId"
                value={formData.classId}
                onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                placeholder="e.g., Room 205, Class 3A"
                className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolYear" className="text-sm font-medium text-gray-700">
                School Year
              </Label>
              <Input
                id="schoolYear"
                value={formData.schoolYear}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolYear: e.target.value }))}
                placeholder="e.g., 2024-2025"
                className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Assignment */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            Teaching Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryGrade" className="text-sm font-medium text-gray-700">
                Primary Grade Level
              </Label>
              <Select value={formData.primaryGrade} onValueChange={(value) => setFormData(prev => ({ ...prev, primaryGrade: value }))}>
                <SelectTrigger className="border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select primary grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primarySubject" className="text-sm font-medium text-gray-700">
                Primary Subject Area
              </Label>
              <Select value={formData.primarySubject} onValueChange={(value) => setFormData(prev => ({ ...prev, primarySubject: value }))}>
                <SelectTrigger className="border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select primary subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Grades */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Additional Grade Levels (if applicable)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GRADE_OPTIONS.filter(grade => grade !== formData.primaryGrade).map(grade => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade}`}
                    checked={formData.additionalGrades.includes(grade)}
                    onCheckedChange={(checked) => handleAdditionalGradeChange(grade, checked as boolean)}
                    className="rounded-lg"
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm text-gray-700 cursor-pointer">
                    {grade}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Subjects */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Additional Subject Areas (if applicable)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBJECT_OPTIONS.filter(subject => subject !== formData.primarySubject).map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.additionalSubjects.includes(subject)}
                    onCheckedChange={(checked) => handleAdditionalSubjectChange(subject, checked as boolean)}
                    className="rounded-lg"
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Key className="h-6 w-6" />
            </div>
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
            <Key className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Personal DeepSeek API Key</strong>
              <br />
              To use AI features, you need your own DeepSeek API key. This ensures your data privacy and gives you control over AI usage costs.
              <br />
              <a 
                href="https://platform.deepseek.com/api_keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                Get your free DeepSeek API key
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  DeepSeek API Key Status
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  {profile?.hasDeepSeekApiKey 
                    ? "You have an API key configured. Enter a new one to update it."
                    : "No API key configured. AI features will not work without an API key."
                  }
                </p>
              </div>
              <Badge 
                variant={profile?.hasDeepSeekApiKey ? "default" : "destructive"}
                className={`rounded-xl px-3 py-1 ${
                  profile?.hasDeepSeekApiKey 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200' 
                    : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                }`}
              >
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

            <div className="space-y-2">
              <Label htmlFor="deepSeekApiKey" className="text-sm font-medium text-gray-700">
                {profile?.hasDeepSeekApiKey ? 'Update DeepSeek API Key' : 'DeepSeek API Key'}
              </Label>
              <div className="relative">
                <Input
                  id="deepSeekApiKey"
                  type={showApiKey ? "text" : "password"}
                  value={formData.deepSeekApiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, deepSeekApiKey: e.target.value }))}
                  placeholder={profile?.hasDeepSeekApiKey ? "Enter new API key to update" : "sk-..."}
                  className="border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 pr-10"
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
              <p className="text-xs text-gray-500">
                Your API key is encrypted and stored securely. It's only used to make AI requests on your behalf.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      {profile && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <span className="font-medium text-gray-700">Account Created:</span>
                  <p className="text-gray-600">{formatDate(profile.createdAt)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-600">{formatDate(profile.updatedAt)}</p>
                </div>
              </div>
              <div className="space-y-3">
                {profile.subscriptionStartDate && (
                  <div className="bg-green-50 p-3 rounded-xl">
                    <span className="font-medium text-green-700">Subscription Start:</span>
                    <p className="text-green-600">{formatDate(profile.subscriptionStartDate)}</p>
                  </div>
                )}
                {profile.subscriptionEndDate && (
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <span className="font-medium text-blue-700">Subscription End:</span>
                    <p className="text-blue-600">{formatDate(profile.subscriptionEndDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
