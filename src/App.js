import { Routes, Route } from "react-router-dom";
import { useLocation as useGeoLocation } from "./contexts/LocationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LocationPrompt from "./components/LocationPrompt";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PropertyDetails from "./pages/PropertyDetails";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";
import Services from "./pages/Services";
import EMICalculator from "./pages/EMICalculator";

export default function App() {
  const { prompted } = useGeoLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {!prompted && <LocationPrompt />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/emi-calculator" element={<EMICalculator />} />
      </Routes>
      <Footer />
    </div>
  );
}
