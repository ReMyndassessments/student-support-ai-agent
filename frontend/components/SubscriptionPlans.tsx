import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, Sparkles, Mail, AlertTriangle, Shield, Users, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
    const subject = 'School-Wide Subscription Inquiry - Concern2Care';
    const body = `Hello,

I'm interested in a school-wide subscription for Concern2Care. Please contact me with:

- A quote for [NUMBER_OF_TEACHERS] teachers
- Onboarding and training options
- Payment methods

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

  const samplePricing = [
    { teachers: 25, monthly: 250, annual: 2700, requests: 500 },
    { teachers: 75, monthly: 750, annual: 8100, requests: 1500 },
    { teachers: 150, monthly: 1500, annual: 16200, requests: 3000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative">
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                School-Wide AI Support Platform
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 font-medium">
              Pricing at $10 per Teacher per Month
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Empower your teaching staff with scalable, affordable AI support through Concern2Care, designed to enhance student engagement, streamline workflows, and provide instant assistance.
            </p>
          </div>
        </div>

        {/* Subscription Tiers */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              Subscription Tiers & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">Number of Teachers</TableHead>
                  <TableHead className="font-semibold text-gray-700">Monthly Cost</TableHead>
                  <TableHead className="font-semibold text-gray-700">Annual Cost (10% Discount)</TableHead>
                  <TableHead className="font-semibold text-gray-700">Features Included</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1 - 20</TableCell>
                  <TableCell>$10 x number of teachers</TableCell>
                  <TableCell>$10 x teachers x 12 x 0.9</TableCell>
                  <TableCell>Full access; 20 support requests per teacher per month; all features included</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>21 - 50</TableCell>
                  <TableCell>Same per teacher rate</TableCell>
                  <TableCell>Same per teacher rate</TableCell>
                  <TableCell>Scalable support for growing staff</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>51 - 200</TableCell>
                  <TableCell>Same per teacher rate</TableCell>
                  <TableCell>Same per teacher rate</TableCell>
                  <TableCell>Enterprise-ready support</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>201+</TableCell>
                  <TableCell>Custom pricing</TableCell>
                  <TableCell>Custom pricing</TableCell>
                  <TableCell>Tailored solutions & dedicated support</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sample Pricing */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-t-2xl sm:rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              Sample Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">School Size</TableHead>
                  <TableHead className="font-semibold text-gray-700">Monthly Cost</TableHead>
                  <TableHead className="font-semibold text-gray-700">Annual Cost (10% Discount)</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Support Requests (per month)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samplePricing.map((item) => (
                  <TableRow key={item.teachers}>
                    <TableCell>{item.teachers} Teachers</TableCell>
                    <TableCell>${item.monthly.toLocaleString()}</TableCell>
                    <TableCell>${item.annual.toLocaleString()}</TableCell>
                    <TableCell>{item.requests.toLocaleString()} requests</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Additional Options & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 sm:mb-16">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl sm:rounded-3xl">
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Bulk licensing discounts for districts with 100+ teachers</li>
                <li>Onboarding & training services</li>
                <li>Custom integrations & branding</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl sm:rounded-3xl">
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Billing cycles: Monthly or annual (with 10% discount for annual)</li>
                <li>Each subscription includes up to 20 support requests per teacher per month</li>
                <li>Cancel anytime with prorated billing</li>
                <li>Flexible seat adjustments anytime</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Empower Your School?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Contact our sales team to get a personalized quote and learn how Concern2Care can transform student support in your school or district.
              </p>
              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl rounded-xl sm:rounded-2xl py-4 sm:py-6 px-6 sm:px-8 text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Sales for a Quote
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-3xl mx-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Contact Sales
                    </DialogTitle>
                    <DialogDescription>
                      Get in touch for a school-wide subscription quote.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Sales Email:</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
