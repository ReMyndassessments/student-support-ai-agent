import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, ArrowRight, Sparkles, Mail, AlertTriangle, Shield, Phone, Users, Heart, Loader2, CreditCard, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/clerk-react';
import backend from '~backend/client';

export function SubscriptionPlans() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const { getToken, isSignedIn } = useAuth();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(null), 2000);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: `Please manually copy: ${text}`,
        variant: "destructive"
      });
    }
  };

  const handleEmailContact = (type: 'sales' | 'demo') => {
    const emailData = type === 'sales' ? {
      email: 'sales@remynd.online',
      subject: 'Teacher Subscription Request - Concern2Care',
      body: `Hello,

I would like to subscribe to Concern2Care as an individual teacher.

Please contact me to complete the subscription setup and provide payment instructions.

Thank you!`
    } : {
      email: 'c2c_demo@remynd.online',
      subject: 'Demo Request for Concern2Care',
      body: `Hello,

I would like to request a demo of Concern2Care.

Please contact me to schedule a demonstration.

Thank you!`
    };

    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(emailData.body);
    const mailtoUrl = `mailto:${emailData.email}?subject=${subject}&body=${body}`;
    
    // Try to open email client
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      toast({
        title: "Opening Email Client",
        description: "Your email client should open with a pre-filled message."
      });
      
      // Close dialog after a short delay
      setTimeout(() => {
        if (type === 'sales') setIsContactDialogOpen(false);
        if (type === 'demo') setIsDemoDialogOpen(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error opening email client:', error);
      toast({
        title: "Email Client Error",
        description: "Please use the copy button to get the email address.",
        variant: "destructive"
      });
    }
  };

  const handleDemoRequest = () => {
    setIsDemoDialogOpen(true);
  };

  const handleSubscriptionContact = () => {
    setIsContactDialogOpen(true);
  };

  const handleContactSales = () => {
    setIsContactDialogOpen(true);
  };

  const handlePolarCheckout = async () => {
    if (!isSignedIn) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCheckout(true);
    try {
      console.log('Starting Polar checkout process...');
      const token = await getToken();
      console.log('Got auth token:', token ? 'Token received' : 'No token');
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await backend.with({ 
        auth: async () => ({ authorization: `Bearer ${token}` })
      }).polar.createCheckout({
        planType: 'teacher',
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/plans`
      });

      console.log('Polar checkout response:', response);

      if (response.checkoutUrl) {
        console.log('Redirecting to Polar checkout:', response.checkoutUrl);
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from Polar');
      }
    } catch (error) {
      console.error('Error creating Polar checkout:', error);
      
      let errorMessage = "Failed to create checkout session.";
      if (error instanceof Error) {
        if (error.message.includes('Polar API key not configured')) {
          errorMessage = "Payment system is not configured. Please contact sales directly.";
        } else if (error.message.includes('Product ID not configured')) {
          errorMessage = "Product configuration error. Please contact sales directly.";
        } else if (error.message.includes('401')) {
          errorMessage = "Authentication error. Please try signing in again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Fall back to contact sales
      setTimeout(() => {
        toast({
          title: "Alternative Option",
          description: "Please use the 'Contact Sales' button below for direct subscription setup.",
        });
      }, 2000);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative">
          {/* Decorative elements - hidden on mobile */}
          <div className="hidden sm:block absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="hidden sm:block absolute top-10 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="hidden sm:block absolute -top-5 right-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full opacity-20 animate-pulse delay-500"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simple Teacher Pricing
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 font-medium">
              One plan designed specifically for teachers
            </p>
            <p className="text-sm text-gray-500 font-medium">
              No complicated tiers, just the tools you need
            </p>
          </div>
        </div>

        {/* Payment System Status */}
        <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm sm:text-base">
            <strong>Payment System Setup in Progress</strong>
            <br />
            We're currently finalizing our automated payment system. For immediate access, please contact our sales team directly for secure payment options and quick account setup.
          </AlertDescription>
        </Alert>

        {/* Main Teacher Plan */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <Card className="border-0 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-2xl sm:rounded-t-3xl pt-6 sm:pt-8">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl shadow-lg">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Teacher Plan</CardTitle>
                  <p className="text-white/80 mt-2 text-base sm:text-lg">Everything you need as a teacher</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold">$15</div>
                  <p className="text-white/80 text-sm sm:text-base">per month</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">What's Included:</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  '5 referrals per month included',
                  'AI-powered Tier 2 recommendations',
                  'PDF report generation',
                  'Email sharing with colleagues',
                  'Follow-up implementation assistance',
                  'Personal DeepSeek API key integration',
                  'Professional documentation tools',
                  'Purchase additional referral packages ($5 for 10)'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-3 w-3 bg-white rounded-full" />
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Primary CTA - Contact Sales */}
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation">
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Sales to Subscribe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-3xl mx-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Contact Sales
                      </DialogTitle>
                      <DialogDescription>
                        Get in touch with our sales team for subscription setup and payment options.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900">Email Address:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard('sales@remynd.online', 'Sales email')}
                            className="h-8 px-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            {copiedEmail === 'sales@remynd.online' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-blue-800 font-mono text-sm">sales@remynd.online</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                        <h4 className="font-medium text-emerald-900 mb-2">What to include in your email:</h4>
                        <ul className="text-emerald-800 text-sm space-y-1">
                          <li>• Your name and school</li>
                          <li>• Number of teachers (if for a school)</li>
                          <li>• Timeline for getting started</li>
                          <li>• Preferred payment method</li>
                        </ul>
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2">
                      <Button
                        onClick={() => handleEmailContact('sales')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Open Email Client
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        If your email client doesn't open, use the copy button above
                      </p>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Secondary CTA - Try Checkout (if signed in) */}
                {isSignedIn && (
                  <Button
                    onClick={handlePolarCheckout}
                    disabled={isCreatingCheckout}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base font-semibold touch-manipulation active:scale-95"
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Trying Checkout...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Try Online Checkout (Beta)
                      </>
                    )}
                  </Button>
                )}
                
                <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base font-semibold touch-manipulation active:scale-95"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Request Demo First
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-3xl mx-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                        Request Demo
                      </DialogTitle>
                      <DialogDescription>
                        Schedule a personalized demonstration of Concern2Care.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-amber-900">Email Address:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard('c2c_demo@remynd.online', 'Demo email')}
                            className="h-8 px-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            {copiedEmail === 'c2c_demo@remynd.online' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-amber-800 font-mono text-sm">c2c_demo@remynd.online</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">Perfect for:</h4>
                        <ul className="text-purple-800 text-sm space-y-1">
                          <li>• Individual teachers exploring the platform</li>
                          <li>• Schools considering bulk subscriptions</li>
                          <li>• Anyone wanting to see features in action</li>
                        </ul>
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2">
                      <Button
                        onClick={() => handleEmailContact('demo')}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Open Email Client
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        If your email client doesn't open, use the copy button above
                      </p>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Individual Subscriptions */}
        <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
          <Shield className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm sm:text-base">
            <strong>Why Individual Teacher Subscriptions?</strong>
            <br />
            Each teacher gets their own secure account to protect student data privacy, ensure FERPA compliance, 
            and provide personalized AI recommendations based on your specific teaching style and needs.
          </AlertDescription>
        </Alert>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl shadow-lg mb-3 sm:mb-4">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Ready to Subscribe?
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Contact us to set up your teacher subscription with secure payment options.
              </p>
              <Button
                onClick={handleContactSales}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-lg mb-3 sm:mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Want to See It First?
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Schedule a personalized demo to see how Concern2Care can help you support your students.
              </p>
              <Button
                onClick={handleDemoRequest}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Request Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* What Schools Can Do */}
        <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              For Schools & Districts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                While Concern2Care is designed for individual teachers, schools and districts can:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Purchase subscriptions for their teachers</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Coordinate bulk setup and training</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Receive volume discounts for multiple teachers</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Get dedicated onboarding support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Access priority customer support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">Schedule group training sessions</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 p-4 rounded-xl border border-purple-200">
                <p className="text-purple-800 text-sm sm:text-base">
                  <strong>Interested in setting up Concern2Care for your school?</strong> Contact us to discuss volume pricing, 
                  training options, and how we can help your teachers get the most out of the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="max-w-4xl mx-auto border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Teacher Subscriptions</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Email</p>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-sm font-mono">sales@remynd.online</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('sales@remynd.online', 'Sales email')}
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          {copiedEmail === 'sales@remynd.online' ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-blue-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-emerald-800 text-sm">
                      <strong>Response Time:</strong> We typically respond within 24 hours with subscription details and secure payment options.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Demos & Questions</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Demo Requests</p>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 text-sm font-mono">c2c_demo@remynd.online</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('c2c_demo@remynd.online', 'Demo email')}
                          className="h-6 w-6 p-0 hover:bg-amber-100"
                        >
                          {copiedEmail === 'c2c_demo@remynd.online' ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-amber-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-purple-800 text-sm">
                      <strong>Perfect for:</strong> Individual teachers or schools wanting to see the platform in action before subscribing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">What to Include in Your Email:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <ul className="space-y-1">
                    <li>• Your name and school</li>
                    <li>• Whether you're an individual teacher or representing a school</li>
                    <li>• Number of teachers (if purchasing for a school)</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Timeline for getting started</li>
                    <li>• Any specific questions about the platform</li>
                    <li>• Preferred contact method</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Comparison */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Teachers Love Concern2Care
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, powerful tools designed specifically for classroom teachers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered',
              description: 'Get intelligent Tier 2 intervention recommendations tailored to each student\'s specific needs.',
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your personal account ensures data privacy compliance and protects sensitive student information.',
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50'
            },
            {
              icon: Heart,
              title: 'Teacher-Focused',
              description: 'Built by educators, for educators. Every feature is designed with the classroom teacher in mind.',
              gradient: 'from-emerald-500 to-teal-500',
              bgGradient: 'from-emerald-50 to-teal-50'
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${feature.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-2xl sm:rounded-3xl overflow-hidden touch-manipulation active:scale-95`}>
                <CardContent className="p-6 sm:p-8 text-center relative">
                  <div className="absolute inset-0 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${feature.gradient}`}></div>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 relative z-10`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {[
              {
                question: "How do I subscribe as a teacher?",
                answer: "Contact our sales team at sales@remynd.online for personalized setup. We accept bank transfers, checks, and credit card payments through our secure payment portal."
              },
              {
                question: "Can my school purchase subscriptions for multiple teachers?",
                answer: "Yes! Schools can purchase individual subscriptions for their teachers. We offer volume discounts and can coordinate bulk setup and training for multiple teachers."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept credit cards, bank transfers, and checks. Our sales team will provide detailed payment instructions based on your preference and can set up secure payment options."
              },
              {
                question: "How quickly can I get started?",
                answer: "We can typically activate your account within 24-48 hours after payment is processed. Contact us for expedited setup if needed."
              },
              {
                question: "Is my student data secure?",
                answer: "Absolutely. We follow FERPA guidelines and use enterprise-grade security to protect all student information. Your individual account ensures data privacy and prevents unauthorized access."
              },
              {
                question: "Do you offer training and support?",
                answer: "Yes! We provide email support, help documentation, and can arrange training sessions for schools purchasing multiple subscriptions."
              },
              {
                question: "Can I see a demo before subscribing?",
                answer: "Absolutely! Email c2c_demo@remynd.online to schedule a personalized demonstration of Concern2Care."
              },
              {
                question: "What if I need help setting up my DeepSeek API key?",
                answer: "We provide step-by-step instructions and support to help you set up your personal DeepSeek API key, which enables the AI-powered recommendations."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl sm:rounded-2xl text-left touch-manipulation active:scale-95 transition-transform">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.question}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto">
                Join teachers who are already using AI-powered tools to better support their students.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
                <Button
                  onClick={handleContactSales}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Subscribe Now
                </Button>
                <Button
                  onClick={handleDemoRequest}
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-manipulation active:scale-95"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Request Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
