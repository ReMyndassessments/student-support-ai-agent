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
                
