import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "../contexts/LocationContext";
import { MapPin, Navigation } from "lucide-react";

export default function LocationPrompt() {
  const { t } = useLanguage();
  const { requestLocation, setPrompted } = useLocation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-600/90 to-purple-700/90 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md mx-4 text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <MapPin size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("location_prompt_title")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t("location_prompt_desc")}
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={requestLocation} className="btn-primary flex items-center justify-center gap-2">
            <Navigation size={18} />
            {t("allow_location")}
          </button>
          <button
            onClick={() => setPrompted(true)}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {t("skip")}
          </button>
        </div>
      </div>
    </div>
  );
}
