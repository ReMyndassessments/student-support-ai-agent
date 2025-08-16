import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Search, Calendar, User } from 'lucide-react';
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Referrals
        </h1>
        <p className="text-gray-600">
          View and manage submitted student support referrals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="teacherFilter">Filter by Teacher</Label>
            <Input
              id="teacherFilter"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              placeholder="Enter teacher name to filter..."
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading referrals...</span>
        </div>
      ) : referrals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {teacherFilter 
                ? `No referrals found for teacher "${teacherFilter}"`
                : "No referrals have been submitted yet."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => (
            <Card key={referral.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {referral.studentFirstName} {referral.studentLastInitial}.
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>Grade: {referral.grade}</span>
                      <span>Teacher: {referral.teacher}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(referral.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {referral.id}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Concern Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {referral.concernDescription}
                  </p>
                </div>

                {referral.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {referral.additionalInfo}
                    </p>
                  </div>
                )}

                {referral.aiRecommendations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">AI-Generated Recommendations</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {referral.aiRecommendations}
                      </div>
                    </div>
                    
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
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
  );
}
