
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AppLayout from '../components/layout/AppLayout';
import { CheckCircle2, Calendar, Search, BarChart3, Heart, Users, ShieldCheck } from 'lucide-react';
import { doctors } from '../lib/mock-data';

const Home = () => {
  // Featured doctors (show 3 random doctors)
  const featuredDoctors = doctors.slice(0, 3);

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tbibdaba-light to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Prenez rendez-vous avec les meilleurs médecins au Maroc
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                TbibDaba vous connecte aux professionnels de santé qualifiés. 
                Trouvez un spécialiste, réservez en ligne, et gérez vos rendez-vous en toute simplicité.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white px-6 py-6 text-lg">
                  <Link to="/register-patient">S'inscrire en tant que patient</Link>
                </Button>
                <Button asChild variant="outline" className="border-tbibdaba-green text-tbibdaba-green hover:bg-tbibdaba-green hover:text-white px-6 py-6 text-lg">
                  <Link to="/register-doctor">S'inscrire en tant que médecin</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Doctor consulting with patient" 
                className="rounded-xl shadow-lg animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche?</h2>
            <p className="mt-4 text-xl text-gray-600">Trois étapes simples pour obtenir votre rendez-vous médical</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center animate-slide-up anim-delay-100">
              <div className="bg-tbibdaba-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Search className="text-tbibdaba-teal w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trouvez votre médecin</h3>
              <p className="text-gray-600">Recherchez parmi nos spécialistes qualifiés par spécialité, ville ou disponibilité.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center animate-slide-up anim-delay-200">
              <div className="bg-tbibdaba-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-tbibdaba-teal w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservez en ligne</h3>
              <p className="text-gray-600">Sélectionnez le créneau qui vous convient et confirmez votre rendez-vous instantanément.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center animate-slide-up anim-delay-300">
              <div className="bg-tbibdaba-light w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-tbibdaba-teal w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultez sereinement</h3>
              <p className="text-gray-600">Recevez des rappels de rendez-vous et gérez facilement vos consultations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nos médecins de confiance</h2>
            <p className="mt-4 text-xl text-gray-600">Rencontrez quelques-uns de nos médecins les mieux notés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 card-hover">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{doctor.name}</h3>
                      <p className="text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{doctor.rating} ({doctor.reviewCount} avis)</span>
                    </div>
                    <p className="text-sm text-gray-600">{doctor.city}</p>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">{doctor.about}</p>
                  <Link 
                    to="/register-patient" 
                    className="block w-full py-2 px-4 bg-tbibdaba-teal text-white text-center rounded-md hover:bg-tbibdaba-teal/90 transition-colors"
                  >
                    Prendre rendez-vous
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-tbibdaba-teal text-tbibdaba-teal hover:bg-tbibdaba-teal hover:text-white">
              <Link to="/register-patient">Voir tous les médecins</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                alt="Doctor with digital tablet" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Pourquoi choisir TbibDaba?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Heart className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Qualité médicale</h3>
                    <p className="text-gray-600">Nous sélectionnons uniquement des médecins qualifiés et vérifiés pour vous offrir les meilleurs soins.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Réservation simple</h3>
                    <p className="text-gray-600">Notre système de réservation intuitif vous permet de prendre rendez-vous en quelques clics, 24/7.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Communauté de confiance</h3>
                    <p className="text-gray-600">Rejoignez des milliers de patients satisfaits qui font confiance à TbibDaba pour leurs besoins de santé.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ShieldCheck className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Sécurité des données</h3>
                    <p className="text-gray-600">Vos informations médicales sont protégées par les plus hauts standards de sécurité et de confidentialité.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white">
                  <Link to="/register-patient">S'inscrire gratuitement</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Doctors Section */}
      <section className="py-16 bg-tbibdaba-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Vous êtes médecin?</h2>
              <p className="text-xl text-gray-700 mb-6">
                Rejoignez notre réseau de professionnels de santé et développez votre pratique grâce à notre plateforme digitale.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Gestion simplifiée</h3>
                    <p className="text-gray-600">Gérez facilement votre agenda, réduisez les rendez-vous manqués et optimisez votre temps.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Plus de patients</h3>
                    <p className="text-gray-600">Élargissez votre base de patients et augmentez votre visibilité en ligne.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BarChart3 className="text-tbibdaba-teal mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Outils d'analyse</h3>
                    <p className="text-gray-600">Accédez à des statistiques détaillées sur votre pratique et prenez des décisions éclairées.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white">
                  <Link to="/register-doctor">Rejoindre en tant que médecin</Link>
                </Button>
                <Button asChild variant="outline" className="border-tbibdaba-teal text-tbibdaba-teal hover:bg-tbibdaba-teal hover:text-white">
                  <Link to="/pricing">Voir les tarifs</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
                alt="Doctor with tablet" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tbibdaba-teal to-tbibdaba-teal/80 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Votre santé mérite le meilleur</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Rejoignez des milliers de patients et médecins au Maroc qui font confiance à TbibDaba
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="bg-white text-tbibdaba-teal hover:bg-gray-100">
              <Link to="/register-patient">S'inscrire comme patient</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/register-doctor">S'inscrire comme médecin</Link>
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Home;
