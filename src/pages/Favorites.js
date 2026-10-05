import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import PropertyCard from "../components/PropertyCard";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const favSnap = await getDocs(collection(db, "users", user.uid, "favorites"));
      const ids = favSnap.docs.map((d) => d.data().propertyId);
      setFavIds(new Set(ids));

      const props = [];
      for (const pid of ids) {
        const pSnap = await getDoc(doc(db, "properties", pid));
        if (pSnap.exists()) {
          props.push({ id: pSnap.id, ...pSnap.data() });
        }
      }
      setProperties(props);
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleFav = (id) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setProperties((p) => p.filter((x) => x.id !== id));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Heart size={28} className="text-red-500" />
        {t("nav_favorites")}
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No favorites yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorite={favIds.has(p.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}
