import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, GraduationCap, FileText, Users, LogOut, CreditCard, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react';

interface NavigationProps {
  userEmail?: string;
  userName?: string;
  isAdmin?: boolean;
  onLogout?: () => void;
  onAdminLogin?: (user: { email: string; name: string; isAdmin: boolean }) => void;
}

export function Navigation({ userEmail, userName, isAdmin = false, onLogout, onAdminLogin }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const adminNavItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/new-referral',
      icon: FileText,
      label: 'New Referral'
    },
    {
      to: '/referrals',
      icon: Users,
      label: 'All Referrals'
    }
  ];

  const authenticatedNavItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/new-referral',
      icon: FileText,
      label: 'New Referral'
    },
    {
      to: '/referrals',
      icon: Users,
      label: 'My Referrals'
    },
    {
      to: '/profile',
      icon: User,
      label: 'Profile'
    }
  ];

  const publicNavItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/subscription/plans',
      icon: CreditCard,
      label: 'Subscribe'
    }
  ];

  const navItems = isAdmin ? adminNavItems : (isSignedIn ? authenticatedNavItems : publicNavItems);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Concern2Care
              </div>
              {isAdmin && (
                <div className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-medium rounded-lg">
                  DEMO
                </div>
              )}
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Authentication */}
            <div className="ml-4 flex items-center space-x-2">
              {isAdmin && onLogout ? (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : isSignedIn ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
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
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Authentication */}
              <div className="pt-2 border-t border-white/20 mt-2">
                {isAdmin && onLogout ? (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    variant="outline"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : !isSignedIn ? (
                  <SignInButton mode="modal">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
