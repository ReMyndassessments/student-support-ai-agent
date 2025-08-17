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

export default function App() {
  // In a real app, this would come from authentication
  // For now, using a placeholder that will require subscription
  const userEmail = "teacher@school.edu";

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navigation userEmail={userEmail} />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage userEmail={userEmail} />} />
            <Route path="/new-referral" element={
              <SubscriptionGate userEmail={userEmail} feature="referral creation">
                <ReferralForm />
              </SubscriptionGate>
            } />
            <Route path="/referrals" element={
              <SubscriptionGate userEmail={userEmail} feature="referral management">
                <ReferralList />
              </SubscriptionGate>
            } />
            <Route path="/meeting/:referralId" element={
              <SubscriptionGate userEmail={userEmail} feature="meeting preparation">
                <MeetingPreparation />
              </SubscriptionGate>
            } />
            <Route path="/profile" element={
              <SubscriptionGate userEmail={userEmail} feature="profile management">
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
