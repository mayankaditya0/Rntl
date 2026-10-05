import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import MapModal from "../components/MapModal";
import EnquiryForm from "../components/EnquiryForm";
import {
  MapPin,
  Heart,
  Phone,
  Play,
  MessageCircle,
  Maximize2,
  Grid3X3,
  Compass,
  Users,
  Building2,
  Armchair,
  Layers,
  Car,
  Bath,
  Wind,
  IndianRupee,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "properties", id));
      if (snap.exists()) {
        setProperty({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    const checkFav = async () => {
      const snap = await getDoc(doc(db, "users", user.uid, "favorites", id));
      setIsFavorite(snap.exists());
    };
    checkFav();
  }, [user, id]);

  const toggleFav = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "favorites", id);
    if (isFavorite) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { propertyId: id, addedAt: new Date().toISOString() });
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  const allImages = [];
  if (property.imageUrl) allImages.push(property.imageUrl);
  if (property.images && property.images.length > 0) {
    property.images.forEach((img) => {
      if (!allImages.includes(img)) allImages.push(img);
    });
  }
  const images = allImages.length > 0
    ? allImages
    : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"];

  const gstAmount = property.rent * (property.gstPercent || 18) / 100;
  const totalAmount = Number(property.rent) + Number(property.brokerage || 0) + gstAmount;

  const details = [
    { icon: Grid3X3, label: t("property_bhk"), value: property.bhk },
    { icon: Maximize2, label: t("built_area"), value: property.builtArea ? `${property.builtArea} ${t("sqft")}` : null },
    { icon: Layers, label: t("carpet_area"), value: property.carpetArea ? `${property.carpetArea} ${t("sqft")}` : null },
    { icon: Compass, label: t("facing"), value: property.facing ? t(property.facing) : null },
    { icon: Armchair, label: t("property_furnishing"), value: property.furnishing ? t(property.furnishing) : null },
    { icon: Building2, label: t("property_floor"), value: property.floor ? `${property.floor} / ${property.totalFloors || "—"}` : null },
    { icon: Calendar, label: t("property_age"), value: property.propertyAge },
    { icon: Car, label: t("property_parking"), value: property.parking },
    { icon: Bath, label: t("property_bathroom"), value: property.bathrooms },
    { icon: Wind, label: t("property_balcony"), value: property.balconies },
  ].filter((d) => d.value);

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950">
      {/* Image Gallery */}
      <div className="relative max-w-5xl mx-auto mt-4 px-4">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={images[currentImage]}
            alt={property.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImage ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={16} />
                    {property.address}
                  </p>
                </div>
                {user && (
                  <button
                    onClick={toggleFav}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
                    />
                  </button>
                )}
              </div>

              {property.allowedFor && property.allowedFor.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("allowed_for")}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {property.allowedFor.map((a) => (
                      <span key={a} className="badge badge-green text-xs">
                        {t(a)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details Grid */}
            {details.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("property_features")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {details.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20">
                        <d.icon size={18} className="text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{d.label}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {d.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t("property_description")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Video Tour */}
            {property.videoUrl && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t("video_tour")}
                </h2>
                <button
                  onClick={() => setShowVideo(true)}
                  className="w-full h-48 rounded-xl bg-gray-900 flex items-center justify-center group cursor-pointer relative overflow-hidden"
                >
                  <img
                    src={images[0]}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="relative p-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Play size={32} className="text-white ml-1" />
                  </div>
                </button>
              </div>
            )}

            {/* Map */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Location
              </h2>
              <div
                className="w-full h-64 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setShowMap(true)}
              >
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="glass-card p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pricing
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">{t("monthly_rent")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <IndianRupee size={14} />
                    {Number(property.rent).toLocaleString("en-IN")}
                  </span>
                </div>
                {property.brokerage > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">{t("brokerage")}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <IndianRupee size={14} />
                      {Number(property.brokerage).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("gst")} ({property.gstPercent || 18}%)
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <IndianRupee size={14} />
                    {Math.round(gstAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">{t("total")}</span>
                  <span className="text-xl font-bold text-brand-600 dark:text-brand-400 flex items-center">
                    <IndianRupee size={16} />
                    {Math.round(totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowEnquiry(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  {t("enquire_now")}
                </button>
                {property.ownerPhone && (
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    {t("call_owner")}
                  </a>
                )}
                <button
                  onClick={() => setShowMap(true)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  {t("open_map")}
                </button>
              </div>
            </div>
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

      {showEnquiry && (
        <EnquiryForm
          propertyId={property.id}
          propertyTitle={property.title}
          onClose={() => setShowEnquiry(false)}
        />
      )}

      {showVideo && property.videoUrl && (
        <div className="modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("video_tour")}</h3>
              <button
                onClick={() => setShowVideo(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                title="Video Tour"
                width="100%"
                height="100%"
                src={property.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
