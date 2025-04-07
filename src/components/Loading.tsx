
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-tbibdaba-gray">
      <Loader2 className="h-12 w-12 text-tbibdaba-teal animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gray-700">Chargement...</h2>
    </div>
  );
};

export default Loading;
