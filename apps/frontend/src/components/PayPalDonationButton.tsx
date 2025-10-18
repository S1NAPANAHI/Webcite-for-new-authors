import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, ExternalLink, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PayPalDonationButtonProps {
  /**
   * Your PayPal hosted button ID (get this from PayPal when you create a donation button)
   * Example: 'ABCD1234EFGH5678'
   */
  buttonId?: string;
  /**
   * Default donation amount
   */
  defaultAmount?: number;
  /**
   * Predefined quick amounts
   */
  quickAmounts?: number[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Button variant
   */
  variant?: 'simple' | 'card' | 'amounts';
  /**
   * Business email or PayPal.me username
   */
  paypalId?: string;
}

const PayPalDonationButton: React.FC<PayPalDonationButtonProps> = ({
  buttonId,
  defaultAmount = 10,
  quickAmounts = [5, 10, 25, 50],
  className = '',
  variant = 'simple',
  paypalId = 'your-paypal-email@example.com' // Replace with your PayPal email or PayPal.me username
}) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultAmount);

  const handleDonation = (amount?: number) => {
    const donationAmount = amount || parseFloat(customAmount) || selectedAmount;
    
    if (donationAmount < 1) {
      toast.error('Please enter an amount of at least $1');
      return;
    }

    let paypalUrl;
    
    if (buttonId) {
      // Use PayPal hosted button
      paypalUrl = `https://www.paypal.com/donate/?hosted_button_id=${buttonId}&amount=${donationAmount}`;
    } else if (paypalId.includes('@')) {
      // Use PayPal direct donation link with email
      paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(paypalId)}&amount=${donationAmount}&currency_code=USD`;
    } else {
      // Use PayPal.me link
      paypalUrl = `https://paypal.me/${paypalId}/${donationAmount}USD`;
    }
    
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
    
    // Optional: Track the donation attempt
    toast.success(`Opening PayPal for $${donationAmount} donation`);
  };

  if (variant === 'card') {
    return (
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-2">
            <Banknote className="h-6 w-6 text-blue-600 mr-2" />
            <CardTitle className="text-xl">PayPal Donation</CardTitle>
          </div>
          <CardDescription>
            Support the Zoroastervers with a secure PayPal donation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleDonation(amount)}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  className="text-sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            
            {/* Custom Amount */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="0.01"
                />
              </div>
              <Button 
                onClick={() => handleDonation()}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!customAmount || parseFloat(customAmount) < 1}
              >
                Donate
              </Button>
            </div>
            
            {/* Default Amount Button */}
            <Button 
              onClick={() => handleDonation(selectedAmount)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate ${selectedAmount} via PayPal
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'amounts') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
            <Banknote className="h-5 w-5 text-blue-600 mr-2" />
            Choose Your Donation Amount
          </h3>
        </div>
        
        {/* Quick Amount Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handleDonation(amount)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col p-4 h-auto"
            >
              <span className="text-2xl font-bold">${amount}</span>
              <span className="text-xs opacity-90">via PayPal</span>
            </Button>
          ))}
        </div>
        
        {/* Custom Amount */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              step="0.01"
            />
          </div>
          <Button 
            onClick={() => handleDonation()}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!customAmount || parseFloat(customAmount) < 1}
          >
            Donate ${customAmount || '0.00'}
          </Button>
        </div>
      </div>
    );
  }

  // Simple button variant
  return (
    <Button
      onClick={() => handleDonation()}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      <Banknote className="h-4 w-4 mr-2" />
      Donate via PayPal
      <ExternalLink className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default PayPalDonationButton;