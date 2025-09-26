import Scraper from "./components/Scraper";
import Gradient from "./components/Gradient";
import { useEffect } from "react";

function App() {
  /* Since the backend is hosted on a free tier service that sleeps after inactivity,
  a wake-up call is sent when the frontend loads. */
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        console.log("Backend wake-up: ", response.status);
      } catch (err) {
        console.error("Backend wake-up failed", err);
      }
    };
    wakeBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="flex flex-row items-center gap-2 mb-8">
        <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow">
          AI Article Summarizer
        </h1>
        <Gradient />
      </div>
      <Scraper />
    </div>
  );
}

export default App;