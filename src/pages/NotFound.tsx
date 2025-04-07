
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-xl px-4">
        <h1 className="text-6xl font-bold text-tbibdaba-teal mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-6">Page introuvable</p>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 px-6 py-6 text-lg">
          <a href="/">Retour à l'accueil</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
