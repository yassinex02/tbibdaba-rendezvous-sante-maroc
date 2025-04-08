
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Calendar, Clock, MapPin } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  location?: string;
  isLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  doctorName,
  appointmentDate,
  appointmentTime,
  location,
  isLoading = false
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {(doctorName || appointmentDate || appointmentTime || location) && (
          <div className="bg-gray-50 p-4 rounded-md my-4">
            {doctorName && (
              <p className="font-medium text-gray-900 mb-2">{doctorName}</p>
            )}
            
            <div className="space-y-2 text-sm">
              {appointmentDate && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{appointmentDate}</span>
                </div>
              )}
              
              {appointmentTime && (
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{appointmentTime}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="flex sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fermer
          </Button>
          <Button 
            className="w-full sm:w-auto bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 mt-2 sm:mt-0"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Traitement en cours..."
          >
            Voir mes rendez-vous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
