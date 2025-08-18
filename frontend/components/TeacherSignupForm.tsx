import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import backend from '~backend/client';

interface TeacherSignupFormData {
  email: string;
  name: string;
  schoolName: string;
  schoolDistrict: string;
  teacherType: string;
  subscriptionEndDate: string;
  supportRequestsLimit: number;
}

const TEACHER_TYPES = [
  { value: 'classroom', label: 'Classroom Teacher' },
  { value: 'specialist', label: 'Specialist' },
  { value: 'support', label: 'Support Staff' }
];

export function TeacherSignupForm() {
  const [formData, setFormData] = useState<TeacherSignupFormData>({
    email: '',
    name: '',
    schoolName: '',
    schoolDistrict: '',
    teacherType: 'classroom',
    subscriptionEndDate: getDefaultSubscriptionEndDate(),
    supportRequestsLimit: 20
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  function getDefaultSubscriptionEndDate() {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split('T')[0];
  }

  const handleInputChange = (field: keyof TeacherSignupFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.schoolName || !formData.schoolDistrict || !formData.teacherType || !formData.subscriptionEndDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.supportRequestsLimit < 1 || formData.supportRequestsLimit > 100) {
      toast({
        title: "Invalid Limit",
        description: "Support request limit must be between 1 and 100.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create the teacher account using admin endpoint (no auth required for self-signup)
      const response = await backend.users.createUserByAdmin({
        email: formData.email,
        name: formData.name,
        schoolName: formData.schoolName,
        schoolDistrict: formData.schoolDistrict,
        teacherType: formData.teacherType,
        subscriptionEndDate: formData.subscriptionEndDate
      });

      // Update with support request limit if different from default
      if (formData.supportRequestsLimit !== 20) {
        await backend.users.updateUserByAdmin({
          id: response.id,
          supportRequestsLimit: formData.supportRequestsLimit
        });
      }

      toast({
        title: "Account Created Successfully!",
        description: "Your teacher account has been created. You can now sign in with your email."
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error creating teacher account:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again.";
      
      toast({
        title: "Account Creation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-white/60 px-3 py-2 rounded-xl touch-manipulation active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-6">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Teacher Account
            </span>
          </h1>
          <p className="text-gray-600">
            Join Concern2Care to access AI-powered student support tools
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              Teacher Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-sm font-medium text-gray-700">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schoolName" className="text-right text-sm font-medium text-gray-700">
                School *
              </Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                placeholder="Enter school name"
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schoolDistrict" className="text-right text-sm font-medium text-gray-700">
                District *
              </Label>
              <Input
                id="schoolDistrict"
                value={formData.schoolDistrict}
                onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                placeholder="Enter school district"
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teacherType" className="text-right text-sm font-medium text-gray-700">
                Type *
              </Label>
              <Select value={formData.teacherType} onValueChange={(value) => handleInputChange('teacherType', value)}>
                <SelectTrigger className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEACHER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscriptionEndDate" className="text-right text-sm font-medium text-gray-700">
                Sub. End *
              </Label>
              <Input
                id="subscriptionEndDate"
                type="date"
                value={formData.subscriptionEndDate}
                onChange={(e) => handleInputChange('subscriptionEndDate', e.target.value)}
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supportRequestsLimit" className="text-right text-sm font-medium text-gray-700">
                Limit *
              </Label>
              <Input
                id="supportRequestsLimit"
                type="number"
                min="1"
                max="100"
                value={formData.supportRequestsLimit}
                onChange={(e) => handleInputChange('supportRequestsLimit', Number(e.target.value))}
                className="col-span-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Account Setup</strong>
                <br />
                Your teacher account will be created with the specified subscription period and support request limit. You can sign in with your email after account creation.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl py-6 text-lg font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Teacher Account'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
