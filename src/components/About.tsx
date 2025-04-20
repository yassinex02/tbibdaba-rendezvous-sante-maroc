
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lock, Zap, Gem } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Lock className="h-8 w-8 text-blue-500" />,
      title: t('value_trust'),
      description: "Nous construisons des relations basées sur la transparence et l'intégrité.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: t('value_care'),
      description: "Nous priorisons la santé et le bien-être de chaque patient.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: t('value_accessibility'),
      description: "Nous rendons les soins de santé disponibles pour tous, partout.",
    },
    {
      icon: <Gem className="h-8 w-8 text-green-500" />,
      title: t('value_simplicity'),
      description: "Nous simplifions l'accès aux soins de santé avec une technologie intuitive.",
    },
  ];

  return (
    <div className="bg-white py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{t('about_title')}</h2>
          <p className="text-gray-600 text-lg italic">
            "{t('mission')}"
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gray-50">{value.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TbibDaba. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
