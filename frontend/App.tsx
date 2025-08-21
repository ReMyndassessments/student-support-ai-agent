import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';
import { MeetingPreparation } from './components/MeetingPreparation';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { useEffect } from 'react';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppInner() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      <main className="pb-safe">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/new-referral" element={<ReferralForm />} />
          <Route path="/referrals" element={<ReferralList />} />
          <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
          <Route path="/subscription/plans" element={<SubscriptionPlans />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
