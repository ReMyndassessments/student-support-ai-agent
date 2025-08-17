import { Routes, Route } from 'react-router-dom';
import { Navigation } from './Navigation';
import { LandingPage } from './LandingPage';
import { ReferralForm } from './ReferralForm';
import { ReferralList } from './ReferralList';
import { MeetingPreparation } from './MeetingPreparation';
import { SubscriptionPlans } from './SubscriptionPlans';
import { SubscriptionSuccess } from './SubscriptionSuccess';
import { UserProfile } from './UserProfile';
import { SubscriptionGate } from './SubscriptionGate';
import { useAuth } from '@clerk/clerk-react';

interface AuthenticatedAppProps {
  user: any;
}

export function AuthenticatedApp({ user }: AuthenticatedAppProps) {
  const { signOut } = useAuth();
  
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : userEmail;

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <Navigation 
        userEmail={userEmail} 
        userName={userName}
        isAdmin={false} 
        onLogout={handleLogout} 
      />
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
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  User Profile
                </h1>
                <p className="text-gray-600">
                  Manage your account settings and API configuration
                </p>
              </div>
              <UserProfile />
            </div>
          } />
          
          <Route path="/subscription/plans" element={<SubscriptionPlans />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        </Routes>
      </main>
    </>
  );
}
