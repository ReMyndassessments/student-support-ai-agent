import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/new-referral" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
