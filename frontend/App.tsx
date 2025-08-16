import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { ReferralForm } from './components/ReferralForm';
import { ReferralList } from './components/ReferralList';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ReferralForm />} />
            <Route path="/referrals" element={<ReferralList />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
