import { useEffect } from "react";
import { X, Bell, MessageCircle, FileText } from "lucide-react";

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = { enquiry: FileText, chat: MessageCircle, default: Bell };
  const Icon = icons[toast.type] || icons.default;

  return (
    <div
      className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex items-start gap-3 cursor-pointer shadow-2xl animate-toast-in"
      onClick={() => { toast.onClick?.(); onClose(); }}
    >
      <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-brand-600 dark:text-brand-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{toast.body}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
}
