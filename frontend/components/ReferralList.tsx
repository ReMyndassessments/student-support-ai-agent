import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Search, Calendar, User, FileText, Clock, GraduationCap, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Referral } from '~backend/referrals/list';

export function ReferralList() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherFilter, setTeacherFilter] = useState('');
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
          <h4 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2 first:mt-0">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h4>
        );
      }
      
      // Sub-headings (usually start with **text**)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <h5 key={index} className="text-sm font-semibold text-blue-700 mt-3 mb-1">
            {trimmedLine.replace(/\*\*/g, '')}
          </h5>
        );
      }
      
      // Numbered lists
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="mb-1">
            <span className="font-medium text-gray-900 text-sm">{trimmedLine}</span>
          </div>
        );
      }
      
      // Bullet points
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        return (
          <div key={index} className="ml-3 mb-1 flex items-start">
            <span className="text-blue-500 mr-2 mt-1 text-xs">●</span>
            <span className="text-gray-700 text-sm">{trimmedLine.replace(/^[-•]\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed text-sm">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);
    
    return formattedLines;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Student Referrals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            View and manage submitted student support referrals
          </p>
          <p className="text-xs text-gray-500">
            Powered by Tier2Go from Remynd
          </p>
        </div>

        {/* Filter Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Referrals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="max-w-md">
              <Label htmlFor="teacherFilter" className="text-sm font-medium text-gray-700">
                Filter by Teacher
              </Label>
              <Input
                id="teacherFilter"
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                placeholder="Enter teacher name to filter..."
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600 font-medium">Loading referrals...</p>
            </div>
          </div>
        ) : referrals.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  {teacherFilter 
                    ? `No referrals found for teacher "${teacherFilter}"`
                    : "No referrals have been submitted yet."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Referrals List */
          <div className="space-y-6">
            {referrals.map((referral) => (
              <Card key={referral.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        {referral.studentFirstName} {referral.studentLastInitial}.
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>Grade: {referral.grade}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{referral.teacher} ({referral.teacherPosition})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Submitted: {formatDate(referral.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 self-start sm:self-end">
                        ID: {referral.id}
                      </Badge>
                      <Badge className={getSeverityBadgeColor(referral.severityLevel)}>
                        {referral.severityLevel.charAt(0).toUpperCase() + referral.severityLevel.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {/* Incident Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Incident Date
                      </h4>
                      <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                        {formatIncidentDate(referral.incidentDate)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        Location
                      </h4>
                      <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                        {referral.location}
                      </p>
                    </div>
                  </div>

                  {/* Concern Types */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-500" />
                      Concern Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {referral.concernTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {type}
                        </Badge>
                      ))}
                      {referral.otherConcernType && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {referral.otherConcernType}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Concern Description */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Concern Description
                    </h4>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {referral.concernDescription}
                      </p>
                    </div>
                  </div>

                  {/* Actions Taken */}
                  {referral.actionsTaken.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        Actions Already Taken
                      </h4>
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <div className="flex flex-wrap gap-2">
                          {referral.actionsTaken.map((action, index) => (
                            <Badge key={index} variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
                              {action}
                            </Badge>
                          ))}
                          {referral.otherActionTaken && (
                            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
                              {referral.otherActionTaken}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {referral.aiRecommendations && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Search className="h-4 w-4 text-emerald-500" />
                        AI-Generated Recommendations
                      </h4>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-lg border border-emerald-200">
                        <div className="prose max-w-none">
                          {formatRecommendations(referral.aiRecommendations)}
                        </div>
                      </div>
                      
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-800 leading-relaxed">
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
