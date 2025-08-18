import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';
import { MeetingPreparation } from './components/MeetingPreparation';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { UserProfile } from './components/UserProfile';
import { SubscriptionGate } from './components/SubscriptionGate';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherManagement } from './components/TeacherManagement';
import { AdminSystemSettings } from './components/AdminSystemSettings';
import { AdminDemoData } from './components/AdminDemoData';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { clerkPublishableKey } from './config';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

function AppContent() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    // Check if user is already logged in as admin (check for admin session cookie)
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const adminSession = cookies.find(cookie => cookie.trim().startsWith('admin_session='));
      
      if (adminSession) {
        try {
          const sessionValue = adminSession.split('=')[1];
          const sessionData = JSON.parse(atob(sessionValue));
          if (sessionData.isAdmin && sessionData.email === 'admin@concern2care.demo') {
            setAdminUser({
              email: 'admin@concern2care.demo',
              name: 'Demo Administrator',
              isAdmin: true
            });
          }
        } catch (error) {
          // Invalid session, ignore
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleAdminLogin = (userData: User) => {
    setAdminUser(userData);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    // Clear the admin session cookie
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

  // If admin is logged in, show admin interface
  if (adminUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation 
          userEmail={adminUser.email} 
          userName={adminUser.name}
          isAdmin={adminUser.isAdmin} 
          onLogout={handleAdminLogout} 
        />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage userEmail={adminUser.email} onAdminLogin={handleAdminLogin} />} />
            <Route path="/admin" element={<AdminDashboard user={adminUser} onLogout={handleAdminLogout} />} />
            <Route path="/admin/teachers" element={<TeacherManagement />} />
            <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
            <Route path="/admin/demo-data" element={<AdminDemoData />} />
            <Route path="/new-referral" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
            <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
            <Route path="/subscription/plans" element={<SubscriptionPlans />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SignedOut>
        <Navigation onAdminLogin={handleAdminLogin} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage onAdminLogin={handleAdminLogin} />} />
            <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleAdminLogin} />} />
            <Route path="/subscription/plans" element={<SubscriptionPlans />} />
            <Route path="*" element={<LandingPage onAdminLogin={handleAdminLogin} />} />
          </Routes>
        </main>
      </SignedOut>

      <SignedIn>
        <AuthenticatedApp user={user} />
      </SignedIn>
      
      <Toaster />
    </div>
  );
}

function DemoApp() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in as admin (check for admin session cookie)
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const adminSession = cookies.find(cookie => cookie.trim().startsWith('admin_session='));
      
      if (adminSession) {
        try {
          const sessionValue = adminSession.split('=')[1];
          const sessionData = JSON.parse(atob(sessionValue));
          if (sessionData.isAdmin && sessionData.email === 'admin@concern2care.demo') {
            setAdminUser({
              email: 'admin@concern2care.demo',
              name: 'Demo Administrator',
              isAdmin: true
            });
          }
        } catch (error) {
          // Invalid session, ignore
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleAdminLogin = (userData: User) => {
    setAdminUser(userData);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    // Clear the admin session cookie
    document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

  // If admin is logged in, show admin interface
  if (adminUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation 
          userEmail={adminUser.email} 
          userName={adminUser.name}
          isAdmin={adminUser.isAdmin} 
          onLogout={handleAdminLogout} 
        />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage userEmail={adminUser.email} onAdminLogin={handleAdminLogin} />} />
            <Route path="/admin" element={<AdminDashboard user={adminUser} onLogout={handleAdminLogout} />} />
            <Route path="/admin/teachers" element={<TeacherManagement />} />
            <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
            <Route path="/admin/demo-data" element={<AdminDemoData />} />
            <Route path="/new-referral" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
            <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
            <Route path="*" element={<LandingPage onAdminLogin={handleAdminLogin} />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation onAdminLogin={handleAdminLogin} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage onAdminLogin={handleAdminLogin} />} />
          <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleAdminLogin} />} />
          <Route path="/subscription/plans" element={<SubscriptionPlans />} />
          <Route path="/new-referral" element={<ReferralForm />} />
          <Route path="/referrals" element={<ReferralList />} />
          <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
          <Route path="*" element={<LandingPage onAdminLogin={handleAdminLogin} />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  // If no Clerk key is provided, run in demo mode without authentication
  if (!clerkPublishableKey) {
    return (
      <Router>
        <DemoApp />
      </Router>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Router>
        <AppContent />
      </Router>
    </ClerkProvider>
  );
}
