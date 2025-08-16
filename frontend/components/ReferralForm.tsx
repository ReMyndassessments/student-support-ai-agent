import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Support Referral Form
        </h1>
        <p className="text-gray-600">
          Generate AI-powered Tier 2 intervention recommendations for students who may need 504/IEP accommodations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Please provide the following information about the student and your concerns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Student First Name *</Label>
              <Input
                id="firstName"
                value={formData.studentFirstName}
                onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <Label htmlFor="lastInitial">Student Last Initial *</Label>
              <Input
                id="lastInitial"
                value={formData.studentLastInitial}
                onChange={(e) => handleInputChange('studentLastInitial', e.target.value)}
                placeholder="Enter last initial"
                maxLength={1}
              />
            </div>
            
            <div>
              <Label htmlFor="grade">Grade *</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                placeholder="e.g., 3rd, 7th, 11th"
              />
            </div>
            
            <div>
              <Label htmlFor="teacher">Teacher Name *</Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => handleInputChange('teacher', e.target.value)}
                placeholder="Enter teacher name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="concern">Description of Concern *</Label>
            <Textarea
              id="concern"
              value={formData.concernDescription}
              onChange={(e) => handleInputChange('concernDescription', e.target.value)}
              placeholder="Describe the specific academic, behavioral, or social concerns you've observed..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="additional">Additional Information</Label>
            <Textarea
              id="additional"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any additional context, previous interventions tried, or relevant background information..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                'Generate AI Recommendations'
              )}
            </Button>
            
            {hasGenerated && (
              <Button 
                onClick={saveReferral}
                disabled={isSaving || hasSaved}
                variant={hasSaved ? "outline" : "default"}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : hasSaved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  'Save Referral'
                )}
              </Button>
            )}
            
            <Button onClick={resetForm} variant="outline">
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Tier 2 Intervention Recommendations</CardTitle>
            <CardDescription>
              Review these suggestions and consult with your student support department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {recommendations}
              </div>
            </div>
            
            {disclaimer && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {disclaimer}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
