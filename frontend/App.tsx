import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';
import { MeetingPreparation } from './components/MeetingPreparation';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { AdminLogin } from './components/AdminLogin';
import { TeacherLogin } from './components/TeacherLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherManagement } from './components/TeacherManagement';
import { AdminSystemSettings } from './components/AdminSystemSettings';
import { AdminDemoData } from './components/AdminDemoData';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

function DemoApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (check for session cookies)
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      
      // Check for admin session
      const adminSession = cookies.find(cookie => cookie.trim().startsWith('admin_session='));
      if (adminSession) {
        try {
          const sessionValue = adminSession.split('=')[1];
          const sessionData = JSON.parse(atob(sessionValue));
          if (sessionData.isAdmin && sessionData.email === 'admin@concern2care.demo') {
            setUser({
              email: 'admin@concern2care.demo',
              name: 'Demo Administrator',
              isAdmin: true
            });
            setIsCheckingAuth(false);
            return;
          }
        } catch (error) {
          // Invalid session, continue checking
        }
      }

      // Check for teacher session
      const teacherSession = cookies.find(cookie => cookie.trim().startsWith('teacher_session='));
      if (teacherSession) {
        try {
          const sessionValue = teacherSession.split('=')[1];
          const sessionData = JSON.parse(atob(sessionValue));
          if (sessionData.email && !sessionData.isAdmin) {
            setUser({
              email: sessionData.email,
              name: sessionData.name || 'Teacher',
              isAdmin: false
            });
            setIsCheckingAuth(false);
            return;
          }
        } catch (error) {
          // Invalid session, continue
        }
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    // Clear session cookies
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'teacher_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show appropriate interface
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation 
          userEmail={user.email} 
          userName={user.name}
          isAdmin={user.isAdmin} 
          onLogout={handleLogout} 
        />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage userEmail={user.email} onAdminLogin={handleLogin} />} />
            {user.isAdmin && (
              <>
                <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
                <Route path="/admin/teachers" element={<TeacherManagement />} />
                <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
                <Route path="/admin/demo-data" element={<AdminDemoData />} />
              </>
            )}
            <Route path="/new-referral" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
            <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
            <Route path="/subscription/plans" element={<SubscriptionPlans />} />
            <Route path="*" element={<LandingPage onAdminLogin={handleLogin} />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation onAdminLogin={handleLogin} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage onAdminLogin={handleLogin} />} />
          <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleLogin} />} />
          <Route path="/teacher-login" element={<TeacherLogin onLoginSuccess={handleLogin} />} />
          <Route path="/subscription/plans" element={<SubscriptionPlans />} />
          <Route path="/new-referral" element={<ReferralForm />} />
          <Route path="/referrals" element={<ReferralList />} />
          <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
          <Route path="*" element={<LandingPage onAdminLogin={handleLogin} />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <DemoApp />
    </Router>
  );
}
