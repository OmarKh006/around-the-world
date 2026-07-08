import { useState, useEffect } from "react";

const CACHE_KEY = "countries_cache_v1";
const API_LIMIT = 100;
const PAGE_SIZE = 24;

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

async function fetchCountryByName(name) {
  const response = await fetch(
    `https://api.restcountries.com/countries/v5/names.common/${encodeURIComponent(name)}`,
    {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  const c = data.data?.objects?.[0];

  if (!c) {
    throw new Error(`No country found for "${name}"`);
  }

  return {
    name: c.names.common,
    official: c.names.official,
    capital: c.capitals?.[0]?.name,
    region: c.region,
    subregion: c.subregion,
    population: c.population,
    flag: c.flag?.url_svg || c.flag?.url_png || null,
    languages: c.languages?.map((l) => l.name) ?? [],
    currencies: c.currencies?.map((cur) => cur.name) ?? [],
    borders: c.borders ?? [],
    tld: c.tlds?.[0] ?? null,
  };
}

async function getAllCountriesWithCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Cache read failed, refetching:", err);
  }

  const fetchedCountries = await fetchAllCountries();

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fetchedCountries }));
  } catch (err) {
    console.warn("Cache write failed (possibly quota exceeded):", err);
  }

  return fetchedCountries;
}

export const useFetchData = (countryName) => {
  const [countriesList, setCountriesList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [allCountries, setAllCountries] = useState([]);
  const [offset, setOffset] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [country, setCountry] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (countryName) {
      (async () => {
        setLoading(true);
        setError(false);
        try {
          const data = await fetchCountryByName(countryName);
          setCountry(data);
        } catch (err) {
          setError(true);
          console.error("Error loading country:", err);
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

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
  }, [countryName]);

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

    setCountriesList(filtered.slice(offset, offset + PAGE_SIZE));
    setHasMore(offset + PAGE_SIZE < filtered.length);
  }, [allCountries, selectedRegion, searchQuery, offset]);

  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    setOffset(0);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const goToNextPage = () => {
    setOffset((prev) => prev + PAGE_SIZE);
  };

  const goToPreviousPage = () => {
    setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
  };

  return {
    countriesList,
    allCountries,
    hasMore,
    offset,
    searchInput,
    selectedRegion,
    handleRegionChange,
    handleSearchChange,
    goToNextPage,
    goToPreviousPage,
    country,
    loading,
    error,
  };
};
