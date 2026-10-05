import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  Plus,
  X,
  Save,
  Trash2,
  Edit3,
  MapPin,
  IndianRupee,
  LocateFixed,
  Loader2,
} from "lucide-react";

const EMPTY_FORM = {
  title: "",
  address: "",
  latitude: "",
  longitude: "",
  rent: "",
  brokerage: "",
  gstPercent: "18",
  imageUrl: "",
  images: [],
  videoUrl: "",
  builtArea: "",
  carpetArea: "",
  facing: "",
  bhk: "",
  furnishing: "",
  floor: "",
  totalFloors: "",
  propertyAge: "",
  parking: "",
  bathrooms: "",
  balconies: "",
  features: "",
  description: "",
  allowedFor: [],
  ownerPhone: "",
  category: "rent",
  propertyType: "",
};

const FACING_OPTIONS = [
  "north", "south", "east", "west",
  "north_east", "north_west", "south_east", "south_west",
];
const FURNISHING_OPTIONS = ["furnished", "semi_furnished", "unfurnished"];
const TENANT_OPTIONS = ["bachelor", "married", "couple", "livein", "separated"];
const CATEGORY_OPTIONS = ["rent", "buy", "commercial"];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const snap = await getDocs(collection(db, "properties"));
    setProperties(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const openEdit = (p) => {
    setForm({ ...EMPTY_FORM, ...p, images: p.images || [] });
    setEditId(p.id);
    setImageInput("");
    setShowForm(true);
  };

  const openNew = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setImageInput("");
    setShowForm(true);
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleAllowed = (val) => {
    setForm((f) => {
      const arr = f.allowedFor || [];
      return {
        ...f,
        allowedFor: arr.includes(val)
          ? arr.filter((v) => v !== val)
          : [...arr, val],
      };
    });
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    setForm((f) => ({ ...f, images: [...(f.images || []), imageInput.trim()] }));
    setImageInput("");
  };

  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      latitude: parseFloat(form.latitude) || 0,
      longitude: parseFloat(form.longitude) || 0,
      rent: parseFloat(form.rent) || 0,
      brokerage: parseFloat(form.brokerage) || 0,
      gstPercent: parseFloat(form.gstPercent) || 18,
      builtArea: parseFloat(form.builtArea) || 0,
      carpetArea: parseFloat(form.carpetArea) || 0,
      images: form.images || [],
      updatedAt: new Date().toISOString(),
    };

    if (editId) {
      const { id, ...rest } = data;
      await setDoc(doc(db, "properties", editId), rest, { merge: true });
    } else {
      data.createdAt = new Date().toISOString();
      await addDoc(collection(db, "properties"), data);
    }

    setSaving(false);
    setShowForm(false);
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setImageInput("");
    loadProperties();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await deleteDoc(doc(db, "properties", id));
    loadProperties();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-500">Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("admin_dashboard")}
        </h1>
        <button
          onClick={openNew}
          className="hidden sm:flex btn-primary items-center gap-2"
        >
          <Plus size={18} />
          {t("add_property")}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <div
              key={p.id}
              onClick={() => openEdit(p)}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={p.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"}
                  alt={p.title}
                  className="w-full h-36 object-cover"
                />
                <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-lg capitalize">
                  {p.category || "rent"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin size={12} />
                  {p.address}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center">
                    <IndianRupee size={14} />
                    {Number(p.rent).toLocaleString("en-IN")}/mo
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Edit3 size={14} className="text-brand-600" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={openNew}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary flex items-center justify-center shadow-xl z-30"
      >
        <Plus size={24} />
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editId ? t("edit_property") : t("add_property")}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <div className="flex gap-2">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleChange("category", c)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                        form.category === c
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_title")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_type")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.propertyType}
                    onChange={(e) => handleChange("propertyType", e.target.value)}
                    placeholder="Apartment, Villa, PG..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("property_address")}
                </label>
                <input
                  className="input-glass"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>

              {/* Lat/Long with auto-fill */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("property_latitude")} / {t("property_longitude")}
                  </label>
                  <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
                  >
                    {locating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                    Use My Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="input-glass"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="e.g. 19.0760"
                    required
                  />
                  <input
                    className="input-glass"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="e.g. 72.8777"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_rent")}
                  </label>
                  <input
                    className="input-glass"
                    type="number"
                    value={form.rent}
                    onChange={(e) => handleChange("rent", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_brokerage")}
                  </label>
                  <input
                    className="input-glass"
                    type="number"
                    value={form.brokerage}
                    onChange={(e) => handleChange("brokerage", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_gst")}
                  </label>
                  <input
                    className="input-glass"
                    type="number"
                    value={form.gstPercent}
                    onChange={(e) => handleChange("gstPercent", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_bhk")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.bhk}
                    onChange={(e) => handleChange("bhk", e.target.value)}
                    placeholder="1 BHK, 2 BHK..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_built_area")}
                  </label>
                  <input
                    className="input-glass"
                    type="number"
                    value={form.builtArea}
                    onChange={(e) => handleChange("builtArea", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_carpet_area")}
                  </label>
                  <input
                    className="input-glass"
                    type="number"
                    value={form.carpetArea}
                    onChange={(e) => handleChange("carpetArea", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_facing")}
                  </label>
                  <select
                    className="input-glass"
                    value={form.facing}
                    onChange={(e) => handleChange("facing", e.target.value)}
                  >
                    <option value="">Select</option>
                    {FACING_OPTIONS.map((f) => (
                      <option key={f} value={f}>{t(f)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_furnishing")}
                  </label>
                  <select
                    className="input-glass"
                    value={form.furnishing}
                    onChange={(e) => handleChange("furnishing", e.target.value)}
                  >
                    <option value="">Select</option>
                    {FURNISHING_OPTIONS.map((f) => (
                      <option key={f} value={f}>{t(f)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_parking")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.parking}
                    onChange={(e) => handleChange("parking", e.target.value)}
                    placeholder="Covered, Open..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_floor")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_total_floors")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.totalFloors}
                    onChange={(e) => handleChange("totalFloors", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_bathroom")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("property_balcony")}
                  </label>
                  <input
                    className="input-glass"
                    value={form.balconies}
                    onChange={(e) => handleChange("balconies", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("property_age")}
                </label>
                <input
                  className="input-glass"
                  value={form.propertyAge}
                  onChange={(e) => handleChange("propertyAge", e.target.value)}
                  placeholder="New, 1-5 years, 5-10 years..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Owner/Broker Phone
                </label>
                <input
                  className="input-glass"
                  value={form.ownerPhone}
                  onChange={(e) => handleChange("ownerPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Primary Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary {t("property_image")}
                </label>
                <input
                  className="input-glass"
                  value={form.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                )}
              </div>

              {/* Additional Images URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Images
                </label>
                <div className="flex gap-2">
                  <input
                    className="input-glass flex-1"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste image URL and click Add"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                  />
                  <button type="button" onClick={addImage} className="btn-secondary text-sm flex-shrink-0">
                    Add
                  </button>
                </div>
                {form.images && form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("property_video")}
                </label>
                <input
                  className="input-glass"
                  value={form.videoUrl}
                  onChange={(e) => handleChange("videoUrl", e.target.value)}
                  placeholder="YouTube embed URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("property_allowed")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {TENANT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleAllowed(opt)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        (form.allowedFor || []).includes(opt)
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {t(opt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("property_description")}
                </label>
                <textarea
                  className="input-glass min-h-[100px] resize-none"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={16} />
                  {saving ? t("loading") : editId ? t("update") : t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
