
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Calendar as CalendarIcon, Shield } from 'lucide-react';

interface PaymentStepProps {
  onBack: () => void;
  onComplete: () => void;
  amount: number;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}

const PaymentStep = ({ 
  onBack, 
  onComplete, 
  amount, 
  doctorName, 
  appointmentDate, 
  appointmentTime 
}: PaymentStepProps) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Basic formatting for card fields
    let formattedValue = value;
    if (name === 'cardNumber') {
      // Strip non-digits
      formattedValue = value.replace(/\D/g, '');
      // Limit to 16 digits
      formattedValue = formattedValue.substring(0, 16);
      // Add spaces every 4 digits
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      // Strip non-digits
      formattedValue = value.replace(/\D/g, '');
      // Limit to 4 digits
      formattedValue = formattedValue.substring(0, 4);
      // Add slash after 2 digits
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
      }
    } else if (name === 'cvv') {
      // Strip non-digits and limit to 3-4 digits
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate card number - should be 16 digits (after stripping spaces)
    if (!paymentData.cardNumber.trim()) {
      newErrors.cardNumber = 'Le numéro de carte est requis';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres';
    }
    
    // Validate card name
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Le nom sur la carte est requis';
    }
    
    // Validate expiry date - should be in MM/YY format
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'La date d\'expiration est requise';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Format invalide. Utilisez MM/YY';
    } else {
      // Check if the date is in the future
      const [month, year] = paymentData.expiryDate.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100; // Get last 2 digits
      const currentMonth = now.getMonth() + 1; // 1-12
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'La carte est expirée';
      }
    }
    
    // Validate CVV - should be 3-4 digits
    if (!paymentData.cvv) {
      newErrors.cvv = 'Le code de sécurité est requis';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Le code doit contenir 3 ou 4 chiffres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Log the payment data to console
    console.log('Payment data:', paymentData);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 1500);
  };

  return (
    <Card className="md:max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Médecin:</span>
            <span className="font-medium">{doctorName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Date:</span>
            <span>{appointmentDate}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Heure:</span>
            <span>{appointmentTime}</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-tbibdaba-teal font-bold">{amount} MAD</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numéro de carte</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs">{errors.cardNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Nom sur la carte</Label>
            <Input
              id="cardName"
              name="cardName"
              value={paymentData.cardName}
              onChange={handleChange}
              placeholder="JEAN DUPONT"
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && (
              <p className="text-red-500 text-xs">{errors.cardName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d'expiration</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className={`pl-10 ${errors.expiryDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.expiryDate && (
                <p className="text-red-500 text-xs">{errors.expiryDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">Code de sécurité (CVV)</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className={`pl-10 ${errors.cvv ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.cvv && (
                <p className="text-red-500 text-xs">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            <p className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-tbibdaba-teal" />
              Votre paiement est sécurisé. Nous ne stockons pas vos informations de carte.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isProcessing}
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
          disabled={isProcessing}
          onClick={handleSubmit}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            'Confirmer le paiement'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStep;
