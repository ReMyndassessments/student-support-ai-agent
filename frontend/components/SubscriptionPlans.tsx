import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, Sparkles, Mail, AlertTriangle, Shield, Users, Heart, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// TODO: Replace this with your actual Buy Me a Coffee URL
const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/your-username";

export function SubscriptionPlans() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleEmailContact = () => {
    const email = 'sales@remynd.online';
    const subject = 'Subscription Activation Request - Concern2Care';
    const body = `Hello,

I have just completed my subscription payment via Buy Me a Coffee.

Please activate my subscription for the following email address: [YOUR_EMAIL_HERE]

Thank you!`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Opening Email Client",
        description: "Your email client should open with a pre-filled message."
      });
      
      setTimeout(() => setIsContactDialogOpen(false), 1000);
      
    } catch (error) {
      console.error('Error opening email client:', error);
      toast({
        title: "Email Client Error",
        description: "Please use the copy button to get the email address.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative">
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
          </div>
        </div>

        {/* Subscription Process */}
        <Alert className="max-w-4xl mx-auto mb-8 sm:mb-12 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm sm:text-base">
            <strong>How to Subscribe:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click the "Subscribe via Buy Me a Coffee" button below.</li>
              <li>Complete your payment on the Buy Me a Coffee page.</li>
              <li>After payment, contact us with your receipt to activate your account.</li>
            </ol>
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
                  '5 support requests per month included',
                  'AI-powered Tier 2 recommendations',
                  'PDF report generation',
                  'Email sharing with colleagues',
                  'Follow-up implementation assistance',
                  'Personal DeepSeek API key integration',
                  'Professional documentation tools',
                  'Purchase additional support request packages ($5 for 10)'
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
                <a href={BUY_ME_A_COFFEE_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Subscribe via Buy Me a Coffee
                  </Button>
                </a>
                
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base font-semibold touch-manipulation active:scale-95"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Paid? Contact Us to Activate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-3xl mx-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Activate Your Subscription
                      </DialogTitle>
                      <DialogDescription>
                        After paying, email us your receipt to activate your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900">Activation Email:</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard('sales@remynd.online', 'Activation email')}
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
                          <li>• Your payment receipt from Buy Me a Coffee</li>
                          <li>• The email address used for your Concern2Care account</li>
                        </ul>
                      </div>
                    </div>
                    <DialogFooter className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <Button
                          onClick={handleEmailContact}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Open Email Client
                        </Button>
                        <p className="text-xs text-gray-500 text-center sm:text-left">
                          If your email client doesn't open, use the copy button above.
                        </p>
                      </div>
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
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
              Schools and districts can purchase multiple subscriptions for their teachers. Contact us for volume discounts and streamlined setup.
            </p>
            <Button
              onClick={() => setIsContactDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg rounded-xl sm:rounded-2xl py-3 px-6 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact for School Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
