import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, User, BookOpen, MessageSquare, Sparkles, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { GenerateRecommendationsRequest } from '~backend/ai/generate-recommendations';

export function ReferralForm() {
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastInitial: '',
    grade: '',
    teacher: '',
    concernDescription: '',
    additionalInfo: ''
  });
  
  const [recommendations, setRecommendations] = useState<string>('');
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasGenerated(false);
    setHasSaved(false);
  };

  const generateRecommendations = async () => {
    if (!formData.studentFirstName || !formData.studentLastInitial || !formData.grade || 
        !formData.teacher || !formData.concernDescription) {
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
        concernDescription: formData.concernDescription,
        additionalInfo: formData.additionalInfo || undefined
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
        concernDescription: formData.concernDescription,
        additionalInfo: formData.additionalInfo || undefined,
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
      concernDescription: '',
      additionalInfo: ''
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
            Student Support Referral Form
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Generate AI-powered Tier 2 intervention recommendations for students who may need 504/IEP accommodations
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
            <CardDescription className="text-blue-100">
              Please provide the following information about the student and your concerns.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Student First Name *
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
                  Student Last Initial *
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
                <Label htmlFor="teacher" className="text-sm font-medium text-gray-700">
                  Teacher Name *
                </Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                  placeholder="Enter teacher name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="concern" className="text-sm font-medium text-gray-700">
                Description of Concern *
              </Label>
              <Textarea
                id="concern"
                value={formData.concernDescription}
                onChange={(e) => handleInputChange('concernDescription', e.target.value)}
                placeholder="Describe the specific academic, behavioral, or social concerns you've observed..."
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional" className="text-sm font-medium text-gray-700">
                Additional Information
              </Label>
              <Textarea
                id="additional"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any additional context, previous interventions tried, or relevant background information..."
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI-Generated Tier 2 Intervention Recommendations
              </CardTitle>
              <CardDescription className="text-emerald-100">
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
