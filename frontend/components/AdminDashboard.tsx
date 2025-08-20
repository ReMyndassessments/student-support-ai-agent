import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, FileText, Sparkles, LogOut, User, Settings, CreditCard, TrendingUp, Calendar, AlertTriangle, Database, Download, Trash2, Plus, Edit3, UserPlus, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import backend from '~backend/client';
import type { DashboardStats } from '~backend/admin/dashboard-stats';
import { AddEditTeacherDialog } from './AddEditTeacherDialog';
import { BulkCSVUploadDialog } from './BulkCSVUploadDialog';
import type { UserProfile } from '~backend/users/get-profile';

interface AdminDashboardProps {
  user: { email: string; name: string; isAdmin: boolean };
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await backend.admin.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await backend.auth.adminLogout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'teacher_added':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'support_request':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'teacher_updated':
        return <Settings className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleSaveTeacher = (teacher: UserProfile) => {
    loadDashboardStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xl text-gray-600 mt-1">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 rounded-xl px-6 py-3 text-base font-medium">
                <Shield className="h-5 w-5 mr-2" />
                Administrator
              </Badge>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-3"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {isLoggingOut ? 'Logging Out...' : 'Logout'}
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Teachers</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalTeachers || 0}</p>
                    <p className="text-gray-600 text-sm mt-1">{stats?.activeTeachers || 0} active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Support Requests</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalSupportRequests || 0}</p>
                    <p className="text-gray-600 text-sm mt-1">{stats?.supportRequestsThisMonth || 0} this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Avg per Teacher</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats?.averageRequestsPerTeacher || 0}</p>
                    <p className="text-gray-600 text-sm mt-1">requests total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Features</h3>
                    <p className="text-3xl font-bold text-gray-900">Active</p>
                    <p className="text-gray-600 text-sm mt-1">Full access</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tools and Demo Tools Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Management Tools */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Settings className="h-7 w-7" />
                  </div>
                  Management Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={() => setIsAddTeacherDialogOpen(true)} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-4 text-base font-medium">
                    <UserPlus className="h-5 w-5 mr-3" />
                    Add Single Teacher
                  </Button>
                  <Button onClick={() => setIsBulkUploadDialogOpen(true)} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-4 text-base font-medium">
                    <Upload className="h-5 w-5 mr-3" />
                    Bulk Upload Teachers
                  </Button>
                  <Link to="/admin/teachers">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-4 text-base font-medium">
                      <Users className="h-5 w-5 mr-3" />
                      Manage All Teachers
                    </Button>
                  </Link>
                  <Link to="/admin/system-settings">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-4 text-base font-medium">
                      <Settings className="h-5 w-5 mr-3" />
                      System Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Demo Tools */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  Demo Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/new-referral">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-4 text-base font-medium">
                      <FileText className="h-5 w-5 mr-3" />
                      Demo Support Request
                    </Button>
                  </Link>
                  <Link to="/referrals">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-4 text-base font-medium">
                      <FileText className="h-5 w-5 mr-3" />
                      View All Requests
                    </Button>
                  </Link>
                  <Link to="/admin/demo-data">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-4 text-base font-medium">
                      <Plus className="h-5 w-5 mr-3" />
                      Create Demo Data
                    </Button>
                  </Link>
                  <Link to="/admin/demo-data">
                    <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50 rounded-xl py-4 text-base font-medium">
                      <Trash2 className="h-5 w-5 mr-3" />
                      Clear Demo Data
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Top Concerns Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-7 w-7" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {stats?.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                  {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Concern Types */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  Top Concern Types
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {stats?.topConcernTypes.map((concern, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <span className="text-base font-medium text-gray-900">{concern.type}</span>
                      <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium">
                        {concern.count}
                      </Badge>
                    </div>
                  ))}
                  {(!stats?.topConcernTypes || stats.topConcernTypes.length === 0) && (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No concern data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-3xl">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="h-7 w-7" />
                </div>
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Database</h4>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 rounded-xl px-4 py-2 text-sm font-medium">
                    Operational
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">AI Services</h4>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 rounded-xl px-4 py-2 text-sm font-medium">
                    Active
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Security</h4>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 rounded-xl px-4 py-2 text-sm font-medium">
                    Secure
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddEditTeacherDialog
        isOpen={isAddTeacherDialogOpen}
        onClose={() => setIsAddTeacherDialogOpen(false)}
        onSave={handleSaveTeacher}
        teacher={null}
      />
      <BulkCSVUploadDialog
        isOpen={isBulkUploadDialogOpen}
        onClose={() => setIsBulkUploadDialogOpen(false)}
        onSuccess={loadDashboardStats}
      />
    </div>
  );
}
