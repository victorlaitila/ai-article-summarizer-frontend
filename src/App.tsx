import Scraper from "./components/Scraper";
import Gradient from "./components/Gradient";

function App() {
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