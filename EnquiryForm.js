import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { X, Send } from "lucide-react";

export default function EnquiryForm({ propertyId, propertyTitle, onClose }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    email: user?.email || "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "enquiries"), {
      ...form,
      propertyId,
      propertyTitle,
      userId: user?.uid || "anonymous",
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Send size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t("enquiry_success")}
          </h3>
          <button onClick={onClose} className="btn-primary mt-4">
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("enquire_now")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("enquiry_name")}
            </label>
            <input
              className="input-glass"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("enquiry_phone")}
            </label>
            <input
              className="input-glass"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("enquiry_email")}
            </label>
            <input
              className="input-glass"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("enquiry_message")}
            </label>
            <textarea
              className="input-glass min-h-[100px] resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {loading ? t("loading") : t("submit_enquiry")}
          </button>
        </form>
      </div>
    </div>
  );
}
