
import { ProgressSteps } from '../layout/AppLayout';
import { Button } from '@/components/ui/button';

interface BookingStepsProps {
  currentStep: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
}

const BookingSteps = ({
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  isNextDisabled = false,
  isSubmitting = false
}: BookingStepsProps) => {
  const steps = [
    "Recherche",
    "Sélection",
    "Confirmation"
  ];

  return (
    <div className="mb-8">
      <ProgressSteps steps={steps} currentStep={currentStep} />
      
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="transition-transform hover:-translate-x-1"
          >
            Retour
          </Button>
        )}
        
        <div className="ml-auto">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="transition-transform hover:translate-x-1"
            >
              Continuer
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              isLoading={isSubmitting}
              loadingText="Confirmation en cours..."
              className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
            >
              Confirmer le rendez-vous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
