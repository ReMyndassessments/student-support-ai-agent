import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, AlertTriangle, CheckCircle, User, BookOpen, MessageSquare, Sparkles, Save, RotateCcw, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { GenerateRecommendationsRequest } from '~backend/ai/generate-recommendations';

const CONCERN_TYPES = [
  'Academic',
  'Attendance', 
  'Behavior',
  'Social/Emotional',
  'Peer Relationships',
  'Family/Home'
];

const SEVERITY_LEVELS = [
  { value: 'mild', label: 'Mild – Needs classroom support' },
  { value: 'moderate', label: 'Moderate – Needs Tier 2 intervention' },
  { value: 'urgent', label: 'Urgent – Immediate follow-up needed' }
];

const ACTIONS_TAKEN = [
  'Talked with student',
  'Contacted parent',
  'Documented only'
];

export function ReferralForm() {
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastInitial: '',
    grade: '',
    teacher: '',
    teacherPosition: '',
    incidentDate: '',
    location: '',
    concernTypes: [] as string[],
    otherConcernType: '',
    concernDescription: '',
    severityLevel: '',
    actionsTaken: [] as string[],
    otherActionTaken: ''
  });
  
  const [recommendations, setRecommendations] = useState<string>('');
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasGenerated(false);
    setHasSaved(false);
  };

  const handleConcernTypeChange = (concernType: string, checked: boolean) => {
    const updatedTypes = checked 
      ? [...formData.concernTypes, concernType]
      : formData.concernTypes.filter(type => type !== concernType);
    handleInputChange('concernTypes', updatedTypes);
  };

  const handleActionTakenChange = (action: string, checked: boolean) => {
    const updatedActions = checked 
      ? [...formData.actionsTaken, action]
      : formData.actionsTaken.filter(a => a !== action);
    handleInputChange('actionsTaken', updatedActions);
  };

  const generateRecommendations = async () => {
    if (!formData.studentFirstName || !formData.studentLastInitial || !formData.grade || 
        !formData.teacher || !formData.teacherPosition || !formData.incidentDate ||
        !formData.location || formData.concernTypes.length === 0 || !formData.concernDescription ||
        !formData.severityLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const request: GenerateRecommendationsRequest = {
        studentFirstName: formData.studentFirstName,
        studentLastInitial: formData.studentLastInitial,
        grade: formData.grade,
        teacher: formData.teacher,
        teacherPosition: formData.teacherPosition,
        incidentDate: formData.incidentDate,
        location: formData.location,
        concernTypes: formData.concernTypes,
        otherConcernType: formData.otherConcernType || undefined,
        concernDescription: formData.concernDescription,
        severityLevel: formData.severityLevel,
        actionsTaken: formData.actionsTaken,
        otherActionTaken: formData.otherActionTaken || undefined
      };

      const response = await backend.ai.generateRecommendations(request);
      setRecommendations(response.recommendations);
      setDisclaimer(response.disclaimer);
      setHasGenerated(true);
      setHasSaved(false);
      
      toast({
        title: "Recommendations Generated",
        description: "AI recommendations have been generated successfully."
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReferral = async () => {
    if (!hasGenerated) {
      toast({
        title: "Generate Recommendations First",
        description: "Please generate AI recommendations before saving the referral.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await backend.referrals.create({
        studentFirstName: formData.studentFirstName,
        studentLastInitial: formData.studentLastInitial,
        grade: formData.grade,
        teacher: formData.teacher,
        teacherPosition: formData.teacherPosition,
        incidentDate: formData.incidentDate,
        location: formData.location,
        concernTypes: formData.concernTypes,
        otherConcernType: formData.otherConcernType || undefined,
        concernDescription: formData.concernDescription,
        severityLevel: formData.severityLevel,
        actionsTaken: formData.actionsTaken,
        otherActionTaken: formData.otherActionTaken || undefined,
        aiRecommendations: recommendations
      });

      setHasSaved(true);
      toast({
        title: "Referral Saved",
        description: "The referral form has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving referral:', error);
      toast({
        title: "Error",
        description: "Failed to save referral. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentFirstName: '',
      studentLastInitial: '',
      grade: '',
      teacher: '',
      teacherPosition: '',
      incidentDate: '',
      location: '',
      concernTypes: [],
      otherConcernType: '',
      concernDescription: '',
      severityLevel: '',
      actionsTaken: [],
      otherActionTaken: ''
    });
    setRecommendations('');
    setDisclaimer('');
    setHasGenerated(false);
    setHasSaved(false);
  };

  const formatRecommendations = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return null;
      
      // Main headings (usually start with ##)
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('# ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 first:mt-0">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      }
      
      // Sub-headings (usually start with **text**)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <h4 key={index} className="text-base font-semibold text-blue-700 mt-4 mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </h4>
        );
      }
      
      // Numbered lists
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="mb-2">
            <span className="font-medium text-gray-900">{trimmedLine}</span>
          </div>
        );
      }
      
      // Bullet points
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        return (
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-500 mr-2 mt-1.5 text-xs">●</span>
            <span className="text-gray-700">{trimmedLine.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);
    
    return formattedLines;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quick Student Concern Form
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            For AI-Generated Tier 2 Interventions
          </p>
        </div>

        {/* Student Information */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                  Grade *
                </Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="e.g., 3rd, 7th, 11th"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.studentFirstName}
                  onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                  placeholder="Enter first name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastInitial" className="text-sm font-medium text-gray-700">
                  Last Initial *
                </Label>
                <Input
                  id="lastInitial"
                  value={formData.studentLastInitial}
                  onChange={(e) => handleInputChange('studentLastInitial', e.target.value)}
                  placeholder="Enter last initial"
                  maxLength={1}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident/Concern */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Incident/Concern
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentDate" className="text-sm font-medium text-gray-700">
                  Date *
                </Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Classroom, Cafeteria, Hallway"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Type of Concern (check one or more) *
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CONCERN_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`concern-${type}`}
                      checked={formData.concernTypes.includes(type)}
                      onCheckedChange={(checked) => handleConcernTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`concern-${type}`} className="text-sm text-gray-700">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherConcern" className="text-sm font-medium text-gray-700">
                  Other (specify):
                </Label>
                <Input
                  id="otherConcern"
                  value={formData.otherConcernType}
                  onChange={(e) => handleInputChange('otherConcernType', e.target.value)}
                  placeholder="Specify other concern type"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concernDescription" className="text-sm font-medium text-gray-700">
                Details of Concern *
              </Label>
              <Textarea
                id="concernDescription"
                value={formData.concernDescription}
                onChange={(e) => handleInputChange('concernDescription', e.target.value)}
                placeholder="Please briefly describe the situation, behavior, or challenge — e.g., 'Student struggles to complete classwork,' 'Shows frequent anxiety before presentations,' 'Argues with peers during group work'"
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Severity Level *
              </Label>
              <RadioGroup 
                value={formData.severityLevel} 
                onValueChange={(value) => handleInputChange('severityLevel', value)}
                className="space-y-2"
              >
                {SEVERITY_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={`severity-${level.value}`} />
                    <Label htmlFor={`severity-${level.value}`} className="text-sm text-gray-700">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Actions Taken Already (optional)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTIONS_TAKEN.map((action) => (
                  <div key={action} className="flex items-center space-x-2">
                    <Checkbox
                      id={`action-${action}`}
                      checked={formData.actionsTaken.includes(action)}
                      onCheckedChange={(checked) => handleActionTakenChange(action, checked as boolean)}
                    />
                    <Label htmlFor={`action-${action}`} className="text-sm text-gray-700">
                      {action}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherAction" className="text-sm font-medium text-gray-700">
                  Other (specify):
                </Label>
                <Input
                  id="otherAction"
                  value={formData.otherActionTaken}
                  onChange={(e) => handleInputChange('otherActionTaken', e.target.value)}
                  placeholder="Specify other action taken"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Information */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Teacher Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher" className="text-sm font-medium text-gray-700">
                  Name *
                </Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                  placeholder="Enter teacher name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacherPosition" className="text-sm font-medium text-gray-700">
                  Position *
                </Label>
                <Input
                  id="teacherPosition"
                  value={formData.teacherPosition}
                  onChange={(e) => handleInputChange('teacherPosition', e.target.value)}
                  placeholder="e.g., 3rd Grade Teacher, Math Teacher, Special Education"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
              
              {hasGenerated && (
                <Button 
                  onClick={saveReferral}
                  disabled={isSaving || hasSaved}
                  variant={hasSaved ? "outline" : "default"}
                  className={hasSaved ? "border-green-500 text-green-600" : "bg-green-600 hover:bg-green-700 text-white"}
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : hasSaved ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Referral
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                onClick={resetForm} 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Display */}
        {recommendations && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI-Generated Tier 2 Intervention Recommendations
              </CardTitle>
              <CardDescription className="text-purple-100">
                Review these suggestions and consult with your student support department
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <div className="prose max-w-none">
                  {formatRecommendations(recommendations)}
                </div>
              </div>
              
              {disclaimer && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-sm text-amber-800 leading-relaxed">
                    {disclaimer}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
