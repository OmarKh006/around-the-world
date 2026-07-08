import RegionMenu from "../components/RegionMenu";
import SearchInput from "../components/SearchInput";
import CountryList from "../components/CountryList";
import { useEffect, useState } from "react";

const CACHE_KEY = "countries_cache_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const API_LIMIT = 100;

async function fetchAllCountries() {
  const allCountries = [];
  let offset = 0;
  let more = true;

  while (more) {
    const response = await fetch(
      `https://api.restcountries.com/countries/v5?limit=${API_LIMIT}&offset=${offset}`,
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

    allCountries.push(...summary);
    more = data.data.meta.more;
    offset += API_LIMIT;
  }

  return allCountries;
}

async function getAllCountriesWithCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isFresh = Date.now() - timestamp < CACHE_TTL_MS;
      if (isFresh && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Cache read failed, refetching:", err);
  }

  const fresh = await fetchAllCountries();

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: fresh, timestamp: Date.now() }),
    );
  } catch (err) {
    console.warn("Cache write failed (possibly quota exceeded):", err);
  }

  return fresh;
}

const Home = () => {
  const [countriesList, setCountriesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [allCountries, setAllCountries] = useState([]);

  const [offset, setOffset] = useState(0);

  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 24;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getAllCountriesWithCache();
        setAllCountries(data);
      } catch (err) {
        setError(true);
        console.error("Error loading countries:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
      setOffset(0);
    }, 512);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    let filtered = allCountries;

    if (selectedRegion !== "all") {
      filtered = filtered.filter((c) => c.region === selectedRegion);
    }

    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setCountriesList(filtered.slice(offset, offset + limit));
    setHasMore(offset + limit < filtered.length);
  }, [allCountries, selectedRegion, searchQuery, offset]);

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    setOffset(0);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-10 md:h-14 md:flex-row md:gap-0">
        <SearchInput value={searchInput} onChange={handleSearchChange} />
        <RegionMenu
          countriesList={allCountries}
          filterCountriesList={setCountriesList}
          onRegionChange={handleRegionChange}
        />
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
      {!error && !loading && countriesList.length === 0 && (
        <p className="pt-4 text-center text-2xl font-bold">
          No countries match your search.
        </p>
      )}
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
    </>
  );
};

export default Home;
