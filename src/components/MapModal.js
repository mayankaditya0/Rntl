import { X } from "lucide-react";

export default function MapModal({ lat, lng, address, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">
            {address}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="w-full h-[400px] sm:h-[500px]">
          <iframe
            title="Property Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
          />
        </div>
      </div>
    </div>
  );
}
