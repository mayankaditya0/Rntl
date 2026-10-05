import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Calculator, IndianRupee } from "lucide-react";

export default function EMICalculator() {
  const { t } = useLanguage();
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  const emi =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return (
    <div className="min-h-screen pt-20 max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Calculator size={28} className="text-brand-600" />
        {t("loan_calculator")}
      </h1>

      <div className="glass-card p-6 space-y-6">
        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>Loan Amount</span>
            <span className="flex items-center text-brand-600">
              <IndianRupee size={12} />
              {principal.toLocaleString("en-IN")}
            </span>
          </label>
          <input
            type="range"
            min="100000"
            max="50000000"
            step="100000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>Interest Rate</span>
            <span className="text-brand-600">{rate}%</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>Tenure (Years)</span>
            <span className="text-brand-600">{tenure} years</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly EMI</p>
            <p className="text-xl font-bold text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <IndianRupee size={16} />
              {Math.round(emi).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
              <IndianRupee size={16} />
              {Math.round(totalInterest).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Payment</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <IndianRupee size={16} />
              {Math.round(totalPayment).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
