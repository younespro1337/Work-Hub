import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const useGaTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
  
  useEffect(() => {
    if (!window.location.href.includes("localhost")) {
        try {
            ReactGA.initialize(measurementId);
            setInitialized(true);
            console.log("Google Analytics initialized successfully.");

        } catch (error) {
            console.error("Error initializing Google Analytics:", error);
        }
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      try {
          ReactGA.send({
            hitType: "pageview",
            page: location.pathname +  location.search,
            title: document.title,
          });
          console.log(`Tracked page view: ${location.pathname + location.search}`);
      } catch (error) {
        
      }
    }
  }, [initialized, location]);
};

export default useGaTracker;
