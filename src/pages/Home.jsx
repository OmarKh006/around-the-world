import RegionMenu from "../components/RegionMenu";
import SearchInput from "../components/SearchInput";
import CountryList from "../components/CountryList";
import { useFetchData } from "../hooks/useFetchData";

const Home = () => {
  const {
    countriesList,
    allCountries,
    hasMore,
    loading,
    error,
    offset,
    searchInput,
    handleRegionChange,
    handleSearchChange,
    goToNextPage,
    goToPreviousPage,
  } = useFetchData();

  return (
    <>
      <div className="flex flex-col justify-between gap-10 md:h-14 md:flex-row md:gap-0">
        <SearchInput value={searchInput} onChange={handleSearchChange} />
        <RegionMenu
          countriesList={allCountries}
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
          onClick={goToPreviousPage}
          disabled={offset === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Previous
        </button>

        <button
          onClick={goToNextPage}
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
