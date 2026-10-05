import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [prompted, setPrompted] = useState(false);

  const requestLocation = () => {
    setPrompted(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        localStorage.setItem(
          "rntl-location",
          JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        );
      },
      (err) => setError(err.message)
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem("rntl-location");
    if (saved) {
      setLocation(JSON.parse(saved));
      setPrompted(true);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, prompted, requestLocation, setPrompted }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
