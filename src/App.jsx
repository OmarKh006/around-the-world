import { useEffect, useState } from "react";
import "./App.css";
import CountryList from "./components/CountryList";
import Header from "./components/Header";
import RegionMenu from "./components/RegionMenu";
import SearchInput from "./components/SearchInput";

function App() {
  const [countriesList, setCountriesList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const limit = 24;

  const fetchCountriesData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.restcountries.com/countries/v5?limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const summary = data.data.objects.map((c) => ({
        name: c.names.common,
        official: c.names.official,
        capital: c.capitals[0]?.name,
        region: c.region,
        population: c.population,
        flag: c.flag?.url_svg || c.flag?.url_png || null,
      }));

      setCountriesList(summary);
      setHasMore(data.data.meta.more);
    } catch (error) {
      setError(true);
      console.error("Error fetching countries data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountriesData();
  }, [offset]);

  return (
    <div className="min-h-screen bg-gray-100 font-[Inter] dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <div className="container mx-auto px-5 md:px-0">
        <div className="flex flex-col justify-between gap-10 md:h-14 md:flex-row md:gap-0">
          <SearchInput />
          <RegionMenu />
        </div>
        {error && (
          <p className="pt-4 text-center text-2xl font-bold text-red-700">
            Something went wrong
          </p>
        )}
        {loading && (
          <p className="pt-4 text-center text-2xl font-bold">
            Loading the data...
          </p>
        )}
        {!error && !loading && <CountryList data={countriesList} />}
        <div className="mx-auto mt-6 flex w-full items-center justify-between">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
            disabled={offset === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Previous
          </button>

          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={!hasMore}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
