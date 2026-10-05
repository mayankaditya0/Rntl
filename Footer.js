import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, Mail, Phone } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
            >
              {t("app_name")}
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("buy_services")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/services" className="hover:text-brand-600 transition-colors">{t("property_legal")}</Link></li>
              <li><Link to="/services/emi-calculator" className="hover:text-brand-600 transition-colors">{t("loan_calculator")}</Link></li>
              <li><Link to="/services" className="hover:text-brand-600 transition-colors">{t("eligibility_calc")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t("rent_services")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/services" className="hover:text-brand-600 transition-colors">{t("rental_agreement")}</Link></li>
              <li><Link to="/services" className="hover:text-brand-600 transition-colors">{t("packers_movers")}</Link></li>
              <li><Link to="/services" className="hover:text-brand-600 transition-colors">{t("house_cleaning")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2"><Mail size={14} /> support@rntl.in OR mayankaditya10@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +91 7903509930</li>
              <li className="flex items-center gap-2"><Home size={14} /> Noida, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400 space-y-1">
          <p>© {new Date().getFullYear()} Rntl. All rights reserved.</p>
          <p>App developed by <a href="https://www.linkedin.com/in/mayank-aditya-936296131/?isSelfProfile=true"><u>Mayank Aditya</u></a></p>
        </div>
      </div>
    </footer>
  );
}
