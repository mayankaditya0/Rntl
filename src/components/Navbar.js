import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Home,
  Heart,
  LogIn,
  LogOut,
  Shield,
  Wrench,
} from "lucide-react";

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const { lang, switchLang, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const links = [
    { to: "/", label: t("nav_home"), icon: Home },
    { to: "/services", label: t("nav_services"), icon: Wrench },
  ];

  if (user) {
    links.push({ to: "/favorites", label: t("nav_favorites"), icon: Heart });
  }
  if (isAdmin) {
    links.push({ to: "/admin", label: t("nav_admin"), icon: Shield });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
          >
            {t("app_name")}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  loc.pathname === l.to
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <l.icon size={16} />
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchLang(lang === "en" ? "hi" : "en")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={lang === "en" ? "हिंदी" : "English"}
            >
              <Globe size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                {lang === "en" ? "हि" : "EN"}
              </span>
            </button>

            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {dark ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-600" />
              )}
            </button>

            {user ? (
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={16} />
                {t("nav_logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 btn-primary text-sm"
              >
                <LogIn size={16} />
                {t("nav_login")}
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {open ? (
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 pb-4 animate-slide-up">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                loc.pathname === l.to
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-red-500 w-full"
            >
              <LogOut size={16} />
              {t("nav_logout")}
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400"
            >
              <LogIn size={16} />
              {t("nav_login")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
