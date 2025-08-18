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
      }).users.purchaseReferralPackage({
        packages: packagesToPurchase
      });
      
      if (response.success) {
        await loadProfile(); // Refresh profile to show new limits
        toast({
          title: "Packages Purchased",
          description: `Successfully purchased ${packagesToPurchase} referral package(s). Your new limit is ${response.newTotalLimit} referrals per month.`
        });
        setPackagesToPurchase(1);
      }
    } catch (error) {
      console.error('Error purchasing packages:', error);
      toast({
        title: "Error",
        description: "Failed to purchase referral packages. Please try again.",
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

  const getReferralUsageColor = (used: number, total: number) => {
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
      {/* Referral Usage Status */}
      {profile && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              Monthly Referral Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl ${getReferralUsageColor(profile.referralsUsedThisMonth, profile.referralsLimit + (profile.additionalReferralPackages * 10))}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Referrals Used</span>
                    <Badge variant="outline" className="bg-white/60">
                      {profile.referralsUsedThisMonth} / {profile.referralsLimit + (profile.additionalReferralPackages * 10)}
                    </Badge>
                  </div>
                  <div className="w-full bg-white/40 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((profile.referralsUsedThisMonth / (profile.referralsLimit + (profile.additionalReferralPackages * 10))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <span className="font-medium text-blue-900">Base Limit:</span>
                    <p className="text-blue-700">{profile.referralsLimit} referrals</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <span className="font-medium text-purple-900">Extra Packages:</span>
                    <p className="text-purple-700">{profile.additionalReferralPackages} packages</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Need More Referrals?</h4>
                <p className="text-gray-600 text-sm">
                  Purchase additional packages of 10 referrals each for $5 per package.
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
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase {packagesToPurchase} Package{packagesToPurchase > 1 ? 's' : ''}
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
                  Full Name *
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

      {/* School Information */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <School className="h-6 w-6" />
            </div>
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
                  School Name *
                </Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                  placeholder="Enter your school name"
                  className="border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
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
                  className="border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolYear" className="text-sm font-medium text-gray-700">
                  School Year *
                </Label>
                <Input
                  id="schoolYear"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolYear: e.target.value }))}
                  placeholder="e.g., 2024-2025"
                  className="border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                />
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
                  className="border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Assignment */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            Teaching Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Teacher Type *
            </Label>
            <Select value={formData.teacherType} onValueChange={(value) => setFormData(prev => ({ ...prev, teacherType: value }))}>
              <SelectTrigger className="border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEACHER_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Primary Grade *
                </Label>
                <Select value={formData.primaryGrade} onValueChange={(value) => setFormData(prev => ({ ...prev, primaryGrade: value }))}>
                  <SelectTrigger className="border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500">
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
                <Label className="text-sm font-medium text-gray-700">
                  Primary Subject *
                </Label>
                <Select value={formData.primarySubject} onValueChange={(value) => setFormData(prev => ({ ...prev, primarySubject: value }))}>
                  <SelectTrigger className="border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500">
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
            
            <div className="space-y-4">
              {formData.teacherType === 'specialist' && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Additional Grades (for specialists who teach multiple grades)
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {GRADE_OPTIONS.filter(grade => grade !== formData.primaryGrade).map(grade => (
                        <div key={grade} className="flex items-center space-x-2">
                          <Checkbox
                            id={`grade-${grade}`}
                            checked={formData.additionalGrades.includes(grade)}
                            onCheckedChange={(checked) => handleAdditionalGradeChange(grade, checked as boolean)}
                          />
                          <Label htmlFor={`grade-${grade}`} className="text-xs">{grade}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Additional Subjects
                    </Label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {SUBJECT_OPTIONS.filter(subject => subject !== formData.primarySubject).map(subject => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={formData.additionalSubjects.includes(subject)}
                            onCheckedChange={(checked) => handleAdditionalSubjectChange(subject, checked as boolean)}
                          />
                          <Label htmlFor={`subject-${subject}`} className="text-xs">{subject}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {(formData.additionalGrades.length > 0 || formData.additionalSubjects.length > 0) && (
            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Multi-Grade/Subject Teacher Setup</strong>
                <br />
                Your profile is configured for teaching across multiple grades or subjects. This helps provide more accurate AI recommendations based on your diverse teaching responsibilities.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* DeepSeek API Key */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-3xl">
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
                  className="border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 pr-10"
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
          disabled={saving || !formData.name || !formData.schoolName || !formData.primaryGrade || !formData.primarySubject || !formData.schoolYear}
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
