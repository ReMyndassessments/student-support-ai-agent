import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';
import { MeetingPreparation } from './components/MeetingPreparation';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { SubscriptionSuccess } from './components/SubscriptionSuccess';
import { UserProfile } from './components/UserProfile';
import { SubscriptionGate } from './components/SubscriptionGate';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (check for admin session cookie)
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
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
          }
        } catch (error) {
          // Invalid session, ignore
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
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

  // If no user is logged in, show admin login
  if (!user) {
    return (
      <>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
        <Toaster />
      </>
    );
  }

  // If admin is logged in, show admin dashboard or full app
  if (user.isAdmin) {
    return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <Navigation userEmail={user.email} isAdmin={true} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/landing" element={<LandingPage userEmail={user.email} />} />
              <Route path="/new-referral" element={<ReferralForm />} />
              <Route path="/referrals" element={<ReferralList />} />
              <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
              <Route path="/profile" element={
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      Admin Profile
                    </h1>
                    <p className="text-gray-600">
                      Demo administrator account settings
                    </p>
                  </div>
                  <UserProfile userEmail={user.email} />
                </div>
              } />
              <Route path="/subscription/plans" element={<SubscriptionPlans />} />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    );
  }

  // Regular user flow (this won't be reached in demo mode, but keeping for completeness)
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation userEmail={user.email} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage userEmail={user.email} />} />
            <Route path="/new-referral" element={
              <SubscriptionGate userEmail={user.email} feature="referral creation">
                <ReferralForm />
              </SubscriptionGate>
            } />
            <Route path="/referrals" element={
              <SubscriptionGate userEmail={user.email} feature="referral management">
                <ReferralList />
              </SubscriptionGate>
            } />
            <Route path="/meeting/:referralId" element={
              <SubscriptionGate userEmail={user.email} feature="meeting preparation">
                <MeetingPreparation />
              </SubscriptionGate>
            } />
            <Route path="/profile" element={
              <SubscriptionGate userEmail={user.email} feature="profile management">
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      User Profile
                    </h1>
                    <p className="text-gray-600">
                      Manage your account settings and API configuration
                    </p>
                  </div>
                  <UserProfile userEmail={user.email} />
                </div>
              </SubscriptionGate>
            } />
            <Route path="/subscription/plans" element={<SubscriptionPlans />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
