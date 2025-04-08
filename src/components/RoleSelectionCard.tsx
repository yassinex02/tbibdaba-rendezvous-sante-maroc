
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoleSelectionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  buttonText: string;
  linkTo: string;
  variant: 'patient' | 'doctor';
}

const RoleSelectionCard = ({
  title,
  description,
  icon,
  features,
  buttonText,
  linkTo,
  variant
}: RoleSelectionCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`w-full ${variant === 'patient' ? 'border-blue-200' : 'border-teal-200'}`}>
      <CardHeader className={variant === 'patient' ? 'bg-blue-50' : 'bg-teal-50'}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            variant === 'patient' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
          }`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${
                variant === 'patient' ? 'text-blue-500' : 'text-teal-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(linkTo)} 
          className={`w-full ${
            variant === 'patient' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-tbibdaba-teal hover:bg-tbibdaba-teal/90'
          }`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleSelectionCard;
