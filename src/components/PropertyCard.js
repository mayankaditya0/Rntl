import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import {
  MapPin,
  Navigation,
  Heart,
  Maximize2,
  Compass,
  Users,
  IndianRupee,
} from "lucide-react";
import MapModal from "./MapModal";

export default function PropertyCard({ property, isFavorite, onToggleFav }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showMap, setShowMap] = useState(false);

  const toggleFav = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "favorites", property.id);
    if (isFavorite) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { propertyId: property.id, addedAt: new Date().toISOString() });
    }
    onToggleFav && onToggleFav(property.id);
  };

  return (
    <>
      <div className="glass-card overflow-hidden group">
        <div className="relative">
          <Link to={`/property/${property.id}`}>
            <img
              src={property.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"}
              alt={property.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          {property.distance !== undefined && (
            <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-lg">
              <Navigation size={12} className="mr-1" />
              {property.distance.toFixed(1)} {t("km_away")}
            </span>
          )}
          {property.category && (
            <span className="absolute top-3 right-12 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg capitalize">
              {property.category}
            </span>
          )}
          {user && (
            <button
              onClick={toggleFav}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Heart
                size={16}
                className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          )}
        </div>

        <div className="p-4">
          <Link to={`/property/${property.id}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <MapPin size={14} />
            <span className="truncate">{property.address}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {property.builtArea && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                <Maximize2 size={12} />
                {property.builtArea} {t("sqft")}
              </span>
            )}
            {property.facing && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                <Compass size={12} />
                {t(property.facing)}
              </span>
            )}
            {property.allowedFor && property.allowedFor.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                <Users size={12} />
                {property.allowedFor.map((a) => t(a)).join(", ")}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                <IndianRupee size={16} />
                {Number(property.rent).toLocaleString("en-IN")}
                <span className="text-xs font-normal text-gray-400 ml-1">/mo</span>
              </div>
              {property.brokerage > 0 && (
                <span className="text-xs text-gray-400">
                  +₹{Number(property.brokerage).toLocaleString("en-IN")} {t("brokerage")}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowMap(true)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              {t("open_map")}
            </button>
          </div>
        </div>
      </div>

      {showMap && (
        <MapModal
          lat={property.latitude}
          lng={property.longitude}
          address={property.address}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
}
