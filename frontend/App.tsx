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

export default function App() {
  // For demo purposes, using a placeholder email
  // In a real app, this would come from authentication
  const userEmail = "demo@school.edu";

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/new-referral" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
            <Route path="/meeting/:referralId" element={<MeetingPreparation />} />
            <Route path="/profile" element={
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    User Profile
                  </h1>
                  <p className="text-gray-600">
                    Manage your account settings and API configuration
                  </p>
                </div>
                <UserProfile userEmail={userEmail} />
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
