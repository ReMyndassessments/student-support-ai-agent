import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, User, School, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import backend from '~backend/client';

interface TeacherSignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  schoolName: string;
  schoolDistrict: string;
  primaryGrade: string;
  primarySubject: string;
  teacherType: string;
  classId: string;
  schoolYear: string;
}

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

export function TeacherSignupForm() {
  const [formData, setFormData] = useState<TeacherSignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    schoolName: '',
    schoolDistrict: '',
    primaryGrade: '',
    primarySubject: '',
    teacherType: 'classroom',
    classId: '',
    schoolYear: getCurrentSchoolYear()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  function getCurrentSchoolYear() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // School year typically starts in August/September
    if (month >= 7) { // August or later
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  }

  const handleInputChange = (field: keyof TeacherSignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.schoolName || !formData.schoolDistrict || !formData.teacherType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required school information fields.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.primaryGrade || !formData.primarySubject) {
      toast({
        title: "Missing Information",
        description: "Please select your primary grade and subject.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      // Create the teacher account
      const response = await backend.users.createUserByAdmin({
        email: formData.email,
        name: formData.name,
        schoolName: formData.schoolName,
        schoolDistrict: formData.schoolDistrict,
        teacherType: formData.teacherType,
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      });

      // Update with additional profile information
      await backend.users.updateUserByAdmin({
        id: response.id,
        name: formData.name,
        schoolName: formData.schoolName,
        schoolDistrict: formData.schoolDistrict,
        teacherType: formData.teacherType
      });

      toast({
        title: "Account Created Successfully!",
        description: "Your teacher account has been created. You can now sign in."
      });

      // Redirect to sign in page or dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-6">
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

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          {/* Step 1: Account Information */}
          {step === 1 && (
            <>
              <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password (min. 8 characters)"
                    className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Continue to School Information
                </Button>
              </CardContent>
            </>
          )}

          {/* Step 2: School Information */}
          {step === 2 && (
            <>
              <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <School className="h-6 w-6" />
                  </div>
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
                    School Name *
                  </Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    placeholder="Enter your school name"
                    className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolDistrict" className="text-sm font-medium text-gray-700">
                    School District *
                  </Label>
                  <Input
                    id="schoolDistrict"
                    value={formData.schoolDistrict}
                    onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                    placeholder="Enter your school district"
                    className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherType" className="text-sm font-medium text-gray-700">
                    Teacher Type *
                  </Label>
                  <Select value={formData.teacherType} onValueChange={(value) => handleInputChange('teacherType', value)}>
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
                    Class/Room ID (optional)
                  </Label>
                  <Input
                    id="classId"
                    value={formData.classId}
                    onChange={(e) => handleInputChange('classId', e.target.value)}
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
                    onChange={(e) => handleInputChange('schoolYear', e.target.value)}
                    placeholder="e.g., 2024-2025"
                    className="border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl py-6 text-lg font-semibold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Continue to Teaching Assignment
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Teaching Assignment */}
          {step === 3 && (
            <>
              <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  Teaching Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryGrade" className="text-sm font-medium text-gray-700">
                    Primary Grade Level *
                  </Label>
                  <Select value={formData.primaryGrade} onValueChange={(value) => handleInputChange('primaryGrade', value)}>
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
                    Primary Subject Area *
                  </Label>
                  <Select value={formData.primarySubject} onValueChange={(value) => handleInputChange('primarySubject', value)}>
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

                <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Almost Done!</strong>
                    <br />
                    You can add additional grades and subjects after creating your account in your profile settings.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button
                    onClick={handlePrevStep}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl py-6 text-lg font-semibold"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-xl rounded-2xl py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            </>
          )}
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
