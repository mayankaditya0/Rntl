import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useLocation } from "../contexts/LocationContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { sortByDistance } from "../utils/haversine";
import PropertyCard from "../components/PropertyCard";
import { Search, Building2, Home as HomeIcon, Store } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { location } = useLocation();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("rent");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "properties"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProperties(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadFavs = async () => {
      const { getDocs, collection } = await import("firebase/firestore");
      const snap = await getDocs(collection(db, "users", user.uid, "favorites"));
      setFavorites(new Set(snap.docs.map((d) => d.data().propertyId)));
    };
    loadFavs();
  }, [user]);

  useEffect(() => {
    let result = properties.filter(
      (p) => (p.category || "rent") === tab
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.address || "").toLowerCase().includes(q)
      );
    }

    if (location) {
      result = sortByDistance(result, location.lat, location.lon);
    }

    setFiltered(result);
  }, [properties, tab, search, location]);

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs = [
    { key: "rent", label: t("for_rent"), icon: HomeIcon },
    { key: "buy", label: t("for_buy"), icon: Building2 },
    { key: "commercial", label: t("for_commercial"), icon: Store },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 dark:from-brand-900 dark:via-gray-900 dark:to-purple-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            {t("tagline")}
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl animate-fade-in">
            Discover premium rental properties near you with transparent pricing and zero hassle.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl animate-slide-up">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white border-0 outline-none text-base shadow-2xl placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 mt-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === tb.key
                  ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <tb.icon size={16} />
              {tb.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="mt-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {location ? t("nearby_properties") : t("all_properties")}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t("no_results")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavorite={favorites.has(p.id)}
                  onToggleFav={toggleFav}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
