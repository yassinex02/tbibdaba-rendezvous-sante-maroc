
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  onSubmit: (review: {
    rating: number;
    comment: string;
    doctorId: string;
    appointmentId: string;
  }) => void;
  onCancel: () => void;
}

const ReviewForm = ({ 
  doctorId, 
  doctorName, 
  appointmentId, 
  onSubmit, 
  onCancel 
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez donner une note avant de soumettre",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Commentaire requis",
        description: "Veuillez laisser un commentaire avant de soumettre",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Call the parent's onSubmit function with the review data
    onSubmit({
      rating,
      comment,
      doctorId,
      appointmentId,
    });
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Évaluer {doctorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Note
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Donner une note de ${star} sur 5`}
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {rating === 1 && "Très insatisfait"}
                {rating === 2 && "Insatisfait"}
                {rating === 3 && "Neutre"}
                {rating === 4 && "Satisfait"}
                {rating === 5 && "Très satisfait"}
              </p>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Commentaire
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Partagez votre expérience avec ce médecin..."
                className="w-full"
                aria-label="Commentaire sur votre expérience avec ce médecin"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Annuler"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
          aria-label="Soumettre l'évaluation"
        >
          Soumettre l'évaluation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewForm;
