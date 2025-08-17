import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, Search, ArrowLeft, FileText, Share2, Mail, Download, Users, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import backend from '~backend/client';
import type { Referral } from '~backend/referrals/list';

export function ReferralList() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherFilter, setTeacherFilter] = useState('');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    senderName: '',
    message: ''
  });
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReferrals();
  }, [teacherFilter]);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const response = await backend.referrals.list({
        limit: 50,
        teacher: teacherFilter || undefined
      });
      setReferrals(response.referrals);
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast({
        title: "Error",
        description: "Failed to load referrals. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailShare = async () => {
    if (!selectedReferral || !emailForm.recipientEmail || !emailForm.senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      const response = await backend.referrals.shareEmail({
        referralId: selectedReferral.id,
        recipientEmail: emailForm.recipientEmail,
        senderName: emailForm.senderName,
        message: emailForm.message || undefined
      });

      if (response.success) {
        toast({
          title: "Email Sent",
          description: response.message
        });
        setIsEmailDialogOpen(false);
        setEmailForm({ recipientEmail: '', senderName: '', message: '' });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sharing email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleGeneratePDF = async (referral: Referral) => {
    setIsGeneratingPDF(true);
    try {
      const response = await backend.referrals.generatePDF({
        referralId: referral.id
      });

      // Create a blob from the base64 PDF content
      const pdfBlob = new Blob([
        Uint8Array.from(atob(response.pdfContent), c => c.charCodeAt(0))
      ], { type: 'application/pdf' });

      // Create download link
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
        description: "The referral PDF has been downloaded successfully."
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

  const handlePrintView = (referral: Referral) => {
    // Open a new window with a print-friendly view
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const concernTypes = referral.concernTypes.concat(referral.otherConcernType ? [referral.otherConcernType] : []);
    const actionsTaken = referral.actionsTaken.concat(referral.otherActionTaken ? [referral.otherActionTaken] : []);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Support Referral - ${referral.studentFirstName} ${referral.studentLastInitial}.</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #2563eb; margin: 0; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .section-title { background-color: #f3f4f6; padding: 10px; border-left: 4px solid #2563eb; font-weight: bold; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: bold; }
          .info-value { margin-top: 5px; padding: 8px; background-color: #f9fafb; border-radius: 4px; }
          .concern-description { background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
          .recommendations { background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .badge { display: inline-block; padding: 4px 8px; background-color: #e5e7eb; border-radius: 4px; font-size: 12px; margin-right: 8px; }
          .disclaimer { background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-top: 20px; font-size: 12px; color: #991b1b; }
          @media print { body { margin: 0; } .section { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Student Support Referral</h1>
          <p><strong>Concern2Care</strong> - AI-Powered Student Support System</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Student Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Student Name:</div>
              <div class="info-value">${referral.studentFirstName} ${referral.studentLastInitial}.</div>
            </div>
            <div class="info-item">
              <div class="info-label">Grade:</div>
              <div class="info-value">${referral.grade}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Teacher:</div>
              <div class="info-value">${referral.teacher}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Position:</div>
              <div class="info-value">${referral.teacherPosition}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Incident Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Date:</div>
              <div class="info-value">${formatIncidentDate(referral.incidentDate)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Location:</div>
              <div class="info-value">${referral.location}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Severity:</div>
              <div class="info-value">${referral.severityLevel.charAt(0).toUpperCase() + referral.severityLevel.slice(1)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Referral ID:</div>
              <div class="info-value">#${referral.id}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Concern Types</div>
          <div>
            ${concernTypes.map(type => `<span class="badge">${type}</span>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Concern Description</div>
          <div class="concern-description">${referral.concernDescription}</div>
        </div>

        ${actionsTaken.length > 0 ? `
        <div class="section">
          <div class="section-title">Actions Already Taken</div>
          <div>
            ${actionsTaken.map(action => `<span class="badge">${action}</span>`).join('')}
          </div>
        </div>
        ` : ''}

        ${referral.aiRecommendations ? `
        <div class="section">
          <div class="section-title">AI-Generated Recommendations</div>
          <div class="recommendations">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${referral.aiRecommendations}</pre>
          </div>
          <div class="disclaimer">
            <strong>⚠️ DISCLAIMER:</strong> These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment.
          </div>
        </div>
        ` : ''}

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatIncidentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRecommendations = (text: string) => {
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return null;
      
      // Check for follow-up assistance section
      if (trimmedLine === '--- FOLLOW-UP ASSISTANCE ---') {
        return (
          <div key={index} className="border-t border-blue-300 mt-6 pt-6">
            <h4 className="text-base font-semibold text-blue-700 mb-3">
              Follow-up Implementation Assistance
            </h4>
          </div>
        );
      }
      
      if (trimmedLine.startsWith('Teacher\'s Question:')) {
        return (
          <div key={index} className="bg-blue-100 p-3 rounded-lg mb-3">
            <h5 className="text-sm font-medium text-blue-800 mb-1">Teacher's Question:</h5>
            <p className="text-sm text-blue-700">{trimmedLine.replace('Teacher\'s Question:', '').trim()}</p>
          </div>
        );
      }
      
      if (trimmedLine === 'Additional Guidance:') {
        return (
          <h5 key={index} className="text-sm font-medium text-blue-800 mt-3 mb-2">
            Additional Guidance:
          </h5>
        );
      }
      
      if (trimmedLine.startsWith('##') || trimmedLine.startsWith('# ')) {
        return (
          <h4 key={index} className="text-base font-semibold text-gray-900 mt-4 mb-2 first:mt-0">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h4>
        );
      }
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <h5 key={index} className="text-sm font-medium text-gray-800 mt-3 mb-1">
            {trimmedLine.replace(/\*\*/g, '')}
          </h5>
        );
      }
      
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="mb-1">
            <span className="font-medium text-gray-900 text-sm">{trimmedLine}</span>
          </div>
        );
      }
      
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        return (
          <div key={index} className="ml-3 mb-1 flex items-start">
            <span className="text-gray-400 mr-2 mt-1 text-xs">•</span>
            <span className="text-gray-700 text-sm">{trimmedLine.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed text-sm">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);
    
    return formattedLines;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Student Referrals
          </h1>
          <p className="text-gray-600">
            View and manage submitted student support referrals
          </p>
        </div>

        {/* Filter */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="teacherFilter" className="text-sm font-medium text-gray-700">
                Filter by Teacher
              </Label>
              <Input
                id="teacherFilter"
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                placeholder="Enter teacher name to filter..."
                className="mt-1 border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto" />
              <p className="text-gray-600">Loading referrals...</p>
            </div>
          </div>
        ) : referrals.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {teacherFilter 
                  ? `No referrals found for teacher "${teacherFilter}"`
                  : "No referrals have been submitted yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Referrals List */
          <div className="space-y-6">
            {referrals.map((referral) => (
              <Card key={referral.id} className="border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-medium text-gray-900">
                        {referral.studentFirstName} {referral.studentLastInitial}.
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>Grade: {referral.grade}</span>
                        <span>{referral.teacher} ({referral.teacherPosition})</span>
                        <span>Submitted: {formatDate(referral.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge variant="secondary" className="self-start sm:self-end">
                        ID: {referral.id}
                      </Badge>
                      <Badge className={getSeverityBadgeColor(referral.severityLevel)}>
                        {referral.severityLevel.charAt(0).toUpperCase() + referral.severityLevel.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Meeting Preparation Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Meeting Preparation</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGeneratePDF(referral)}
                        disabled={isGeneratingPDF}
                        className="text-xs"
                      >
                        {isGeneratingPDF ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3 mr-1" />
                        )}
                        Download PDF
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrintView(referral)}
                        className="text-xs"
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Print View
                      </Button>
                      
                      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReferral(referral)}
                            className="text-xs"
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email Share
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Share Referral via Email</DialogTitle>
                            <DialogDescription>
                              Send this referral to colleagues for the student support meeting.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientEmail">Recipient Email *</Label>
                              <Input
                                id="recipientEmail"
                                type="email"
                                value={emailForm.recipientEmail}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                                placeholder="colleague@school.edu"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderName">Your Name *</Label>
                              <Input
                                id="senderName"
                                value={emailForm.senderName}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, senderName: e.target.value }))}
                                placeholder="Your full name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">Message (optional)</Label>
                              <Textarea
                                id="message"
                                value={emailForm.message}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Additional context for the meeting..."
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleEmailShare}
                              disabled={isSharing}
                              className="w-full"
                            >
                              {isSharing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Incident Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">Incident Date</h4>
                      <p className="text-sm text-gray-600">{formatIncidentDate(referral.incidentDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-sm text-gray-600">{referral.location}</p>
                    </div>
                  </div>

                  {/* Concern Types */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Concern Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {referral.concernTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {referral.otherConcernType && (
                        <Badge variant="outline" className="text-xs">
                          {referral.otherConcernType}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Concern Description */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Concern Description</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {referral.concernDescription}
                      </p>
                    </div>
                  </div>

                  {/* Actions Taken */}
                  {referral.actionsTaken.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Actions Already Taken</h4>
                      <div className="flex flex-wrap gap-2">
                        {referral.actionsTaken.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                        {referral.otherActionTaken && (
                          <Badge variant="outline" className="text-xs">
                            {referral.otherActionTaken}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {referral.aiRecommendations && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">AI-Generated Recommendations</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="prose max-w-none">
                          {formatRecommendations(referral.aiRecommendations)}
                        </div>
                      </div>
                      
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-800">
                          ⚠️ IMPORTANT DISCLAIMER: These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
