import { Link, useLocation } from 'react-router-dom';
import { FileText, List, Home, Menu, X, GraduationCap, CreditCard, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '../hooks/useSubscription';

interface NavigationProps {
  userEmail?: string;
}

export function Navigation({ userEmail = "demo@school.edu" }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { hasActiveSubscription } = useSubscription(userEmail);

  // Demo user or active subscription can access all features
  const canAccessPremiumFeatures = userEmail === "demo@school.edu" || hasActiveSubscription;

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
      requiresSubscription: false
    },
    {
      to: '/new-referral',
      icon: FileText,
      label: 'New Referral',
      requiresSubscription: true
    },
    {
      to: '/referrals',
      icon: List,
      label: 'View Referrals',
      requiresSubscription: true
    },
    {
      to: '/profile',
      icon: User,
      label: 'Profile',
      requiresSubscription: true
    },
    {
      to: '/subscription/plans',
      icon: CreditCard,
      label: 'Subscribe',
      requiresSubscription: false
    }
  ];

  // Filter nav items based on subscription status
  const visibleNavItems = navItems.filter(item => 
    !item.requiresSubscription || canAccessPremiumFeatures
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Concern2Care
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.requiresSubscription && !canAccessPremiumFeatures;
              
              return (
                <Link
                  key={item.to}
                  to={isDisabled ? '/subscription/plans' : item.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.to && !isDisabled
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : isDisabled
                      ? 'text-gray-400 hover:text-gray-500 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isDisabled && (
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/60"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-3">
            <div className="space-y-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isDisabled = item.requiresSubscription && !canAccessPremiumFeatures;
                
                return (
                  <Link
                    key={item.to}
                    to={isDisabled ? '/subscription/plans' : item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.to && !isDisabled
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isDisabled && (
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse ml-auto"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
