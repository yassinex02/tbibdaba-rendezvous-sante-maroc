
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { subscriptionPlans } from '../../lib/mock-data';

const FeatureItem = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-start space-x-3">
    {included ? (
      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    ) : (
      <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
    )}
    <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
  </div>
);

const PlanCard = ({ 
  plan, 
  isCurrent, 
  onSelect 
}: { 
  plan: typeof subscriptionPlans[0]; 
  isCurrent: boolean; 
  onSelect: () => void;
}) => {
  const isPopular = plan.id === 'premium';

  return (
    <Card className={`relative ${isPopular ? 'border-tbibdaba-teal shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2">
          <div className="bg-tbibdaba-teal text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
            <Award className="h-3 w-3 mr-1" />
            Le plus choisi
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className={isPopular ? 'text-tbibdaba-teal' : ''}>{plan.name}</CardTitle>
        <CardDescription className="mt-2">
          <span className="text-2xl font-bold">{plan.price} MAD</span>
          <span className="text-gray-500">/mois</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500 min-h-[40px]">{plan.popularFeature}</p>
        <div className="space-y-3">
          {plan.features.map((feature, i) => (
            <FeatureItem key={i} included={true} text={feature} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {isCurrent ? (
          <Button className="w-full" disabled>
            Abonnement actuel
          </Button>
        ) : (
          <Button 
            className={`w-full ${isPopular ? 'bg-tbibdaba-teal hover:bg-tbibdaba-teal/90' : ''}`}
            onClick={onSelect}
          >
            Choisir ce plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = user?.subscription || 'free';

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // Simulate subscription process
    toast({
      title: "Merci pour votre intérêt!",
      description: "Le système de paiement sera disponible prochainement. Votre sélection a été enregistrée.",
    });
    
    // Redirect if user not logged in
    if (!user) {
      setTimeout(() => {
        navigate('/register-doctor');
      }, 2000);
    }
  };

  return (
    <AppLayout>
      <div className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Forfaits adaptés à vos besoins professionnels
            </h1>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui correspond à votre pratique médicale. Changez ou annulez à tout moment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={currentPlan === plan.id}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            ))}
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-tbibdaba-teal flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-lg mb-2">Questions fréquemment posées</h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium">Puis-je changer de forfait à tout moment?</h4>
                    <p className="text-gray-600 mt-1">
                      Oui, vous pouvez passer à un forfait supérieur à tout moment. Le changement prend effet immédiatement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Comment fonctionne la période d'essai?</h4>
                    <p className="text-gray-600 mt-1">
                      Tous les nouveaux comptes médecins bénéficient d'une période d'essai de 30 jours du forfait Basic.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Y a-t-il des frais supplémentaires?</h4>
                    <p className="text-gray-600 mt-1">
                      Non, le prix affiché est tout compris. Il n'y a pas de frais cachés ou de coûts supplémentaires.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Comment annuler mon abonnement?</h4>
                    <p className="text-gray-600 mt-1">
                      Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'accès reste actif jusqu'à la fin de la période de facturation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pricing;
