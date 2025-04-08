
import { Heart, Clock, Users } from 'lucide-react';

const BrandMessage = () => {
  return (
    <div className="bg-white py-10 px-4 md:px-8 rounded-lg shadow-sm border border-gray-100 mb-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Votre santé ne devrait pas attendre
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          <span className="font-medium text-tbibdaba-teal">TbibDaba</span> révolutionne l'accès aux soins de santé au Maroc 
          en connectant patients et médecins sur une plateforme simple et efficace.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-tbibdaba-light p-3 rounded-full mb-3">
              <Clock className="h-6 w-6 text-tbibdaba-teal" />
            </div>
            <h3 className="text-lg font-medium mb-2">Gain de temps</h3>
            <p className="text-gray-600 text-sm">
              Terminé les longues attentes téléphoniques pour obtenir un rendez-vous
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-tbibdaba-light p-3 rounded-full mb-3">
              <Users className="h-6 w-6 text-tbibdaba-teal" />
            </div>
            <h3 className="text-lg font-medium mb-2">Accès facilité</h3>
            <p className="text-gray-600 text-sm">
              Trouvez le bon spécialiste près de chez vous, quand vous en avez besoin
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-tbibdaba-light p-3 rounded-full mb-3">
              <Heart className="h-6 w-6 text-tbibdaba-teal" />
            </div>
            <h3 className="text-lg font-medium mb-2">Qualité des soins</h3>
            <p className="text-gray-600 text-sm">
              Des milliers de médecins certifiés à travers tout le Maroc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandMessage;
