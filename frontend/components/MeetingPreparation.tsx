import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Users, Calendar, MapPin, FileText, Download, Printer, Mail, CheckCircle, Clock, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useParams, Link } from 'react-router-dom';
import backend from '~backend/client';
import type { Referral } from '~backend/referrals/list';

export function MeetingPreparation() {
  const { referralId } = useParams<{ referralId: string }>();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (referralId) {
      loadReferral();
    }
  }, [referralId]);

  const loadReferral = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would have a get single referral endpoint
      const response = await backend.referrals.list({ limit: 1 });
      const foundReferral = response.referrals.find(r => r.id === parseInt(referralId!));
      setReferral(foundReferral || null);
    } catch (error) {
      console.error('Error loading referral:', error);
      toast({
        title: "Error",
        description: "Failed to load referral. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!referral) return;
    
    setIsGeneratingPDF(true);
    try {
      const response = await backend.referrals.generatePDF({
        referralId: referral.id
      });

      const pdfBlob = new Blob([
        Uint8Array.from(atob(response.pdfContent), c => c.charCodeAt(0))
      ], { type: 'application/pdf' });

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Generated",
        description: "The meeting preparation document has been downloaded."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatIncidentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'text-green-700 bg-green-100';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100';
      case 'urgent':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto" />
          <p className="text-gray-600">Loading meeting preparation...</p>
        </div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Referral not found.</p>
            <Link to="/referrals" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Return to Referrals
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-light text-gray-900">
            Student Support Meeting Preparation
          </h1>
          <p className="text-gray-600">
            Comprehensive documentation for {referral.studentFirstName} {referral.studentLastInitial}.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="border border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-blue-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Meeting Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </>
                )}
              </Button>
              
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
              
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email to Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student Overview */}
        <Card>
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="text-xl font-medium text-gray-900">
              Student Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {referral.studentFirstName[0]}{referral.studentLastInitial}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {referral.studentFirstName} {referral.studentLastInitial}.
                    </h3>
                    <p className="text-gray-600">Grade {referral.grade}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Teacher:</span>
                    <span className="text-gray-600">{referral.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Position:</span>
                    <span className="text-gray-600">{referral.teacherPosition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Referral ID:</span>
                    <span className="text-gray-600">#{referral.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Incident Date:</span>
                  <span className="text-gray-600">{formatIncidentDate(referral.incidentDate)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-600">{referral.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Severity:</span>
                  <Badge className={getSeverityColor(referral.severityLevel)}>
                    {referral.severityLevel.charAt(0).toUpperCase() + referral.severityLevel.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="text-gray-600">{formatDate(referral.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concern Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Concern Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Concern Types</h4>
              <div className="flex flex-wrap gap-2">
                {referral.concernTypes.map((type, index) => (
                  <Badge key={index} variant="outline">
                    {type}
                  </Badge>
                ))}
                {referral.otherConcernType && (
                  <Badge variant="outline">
                    {referral.otherConcernType}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-gray-700 leading-relaxed">
                  {referral.concernDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Taken */}
        {referral.actionsTaken.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Actions Already Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {referral.actionsTaken.map((action, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {action}
                  </Badge>
                ))}
                {referral.otherActionTaken && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {referral.otherActionTaken}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        {referral.aiRecommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900">
                Recommended Tier 2 Interventions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                    {referral.aiRecommendations}
                  </pre>
                </div>
              </div>
              
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-800">
                  <strong>Meeting Discussion Point:</strong> These AI-generated recommendations should be reviewed and validated by the student support team. Consider which interventions are most appropriate for implementation and what additional resources may be needed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Meeting Checklist */}
        <Card className="border border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Meeting Preparation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Review student's academic and behavioral history</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Gather input from other teachers who work with this student</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Consider parent/guardian communication and involvement</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Identify available resources and support staff</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Plan timeline for intervention implementation and progress monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-green-800">Determine next steps if interventions are not effective</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Referrals */}
        <div className="text-center">
          <Link 
            to="/referrals"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to All Referrals
          </Link>
        </div>
      </div>
    </div>
  );
}
