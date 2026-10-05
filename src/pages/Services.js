import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Scale,
  Calculator,
  ArrowLeftRight,
  BadgePercent,
  CreditCard,
  MessagesSquare,
  Users,
  FileText,
  Truck,
  Sparkles,
  BookOpen,
  HelpCircle,
  Snowflake,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  FileSignature,
  Stamp,
  UserCheck,
  ScrollText,
  Building2,
  Home as HomeIcon,
} from "lucide-react";

export default function Services() {
  const { t } = useLanguage();

  const buyServices = [
    { icon: Scale, label: t("property_legal"), color: "from-blue-500 to-cyan-500" },
    { icon: Calculator, label: t("loan_calculator"), color: "from-green-500 to-emerald-500", to: "/services/emi-calculator" },
    { icon: ArrowLeftRight, label: t("balance_transfer"), color: "from-orange-500 to-amber-500" },
    { icon: BadgePercent, label: t("eligibility_calc"), color: "from-purple-500 to-violet-500" },
    { icon: CreditCard, label: t("apply_loan"), color: "from-pink-500 to-rose-500" },
    { icon: MessagesSquare, label: t("buyers_forum"), color: "from-teal-500 to-green-500" },
    { icon: Users, label: t("property_buyers"), color: "from-indigo-500 to-blue-500" },
  ];

  const rentServices = [
    { icon: FileText, label: t("rental_agreement"), color: "from-blue-500 to-indigo-500" },
    { icon: Truck, label: t("packers_movers"), color: "from-amber-500 to-orange-500" },
    { icon: Sparkles, label: t("house_cleaning"), color: "from-cyan-500 to-blue-500" },
    { icon: BookOpen, label: t("cleaning_guide"), color: "from-green-500 to-teal-500" },
    { icon: HelpCircle, label: t("cleaning_queries"), color: "from-emerald-500 to-green-500" },
    { icon: Snowflake, label: t("ac_services"), color: "from-sky-500 to-blue-500" },
    { icon: Hammer, label: t("carpentry"), color: "from-orange-500 to-red-500" },
    { icon: Wrench, label: t("carpentry_queries"), color: "from-red-500 to-orange-500" },
    { icon: Zap, label: t("electrician"), color: "from-yellow-500 to-amber-500" },
    { icon: Zap, label: t("electrician_queries"), color: "from-amber-500 to-yellow-500" },
    { icon: Droplets, label: t("plumbing"), color: "from-blue-500 to-cyan-500" },
    { icon: Droplets, label: t("plumbing_queries"), color: "from-cyan-500 to-blue-500" },
    { icon: FileSignature, label: t("lease_agreement"), color: "from-violet-500 to-purple-500" },
    { icon: Stamp, label: t("notary"), color: "from-slate-500 to-gray-500" },
    { icon: UserCheck, label: t("notary_advocate"), color: "from-gray-500 to-slate-500" },
    { icon: ScrollText, label: t("notary_affidavit"), color: "from-stone-500 to-gray-500" },
  ];

  const ServiceCard = ({ icon: Icon, label, color, to }) => {
    const content = (
      <div className="glass-card p-5 flex items-center gap-4 cursor-pointer group">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          <Icon size={22} className="text-white" />
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
          {label}
        </span>
      </div>
    );

    if (to) return <Link to={to}>{content}</Link>;
    return content;
  };

  return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t("services")}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Everything you need for buying, renting, and maintaining your home.
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Building2 size={22} className="text-brand-600" />
          {t("buy_services")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyServices.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <HomeIcon size={22} className="text-brand-600" />
          {t("rent_services")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rentServices.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </section>
    </div>
  );
}
