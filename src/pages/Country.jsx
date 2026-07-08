import { Link, useParams } from "react-router-dom";
import { useFetchData } from "../hooks/useFetchData";

const Country = () => {
  const { country: countryName } = useParams();
  const { country, loading, error } = useFetchData(countryName);

  if (loading) {
    return (
      <p className="pt-4 text-center text-2xl font-bold">Loading the data...</p>
    );
  }

  if (error || !country) {
    return (
      <p className="pt-4 text-center text-2xl font-bold text-red-700">
        Something went wrong
      </p>
    );
  }

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  return (
    <>
      <div className="">
        <Link
          className="mb-16 inline-block rounded-md bg-white p-3 md:mb-20"
          to="/"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="call-made">
              <path
                id="Shape"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.8922 3.53553L7.07071 4.71405L3.18162 8.60313L18.0309 8.60313L18.0309 10.253L3.18162 10.253L7.07071 14.1421L5.8922 15.3206L-0.000355655 9.42809L5.8922 3.53553Z"
                fill="#111827"
              />
            </g>
          </svg>
        </Link>
        <div className="grid gap-11 lg:grid-cols-2 lg:gap-36">
          <img className="w-full" src={country.flag} alt={country.name} />
          <div>
            <h1 className="mb-4 text-3xl font-extrabold lg:mb-7">
              {country.name}
            </h1>
            <div className="flex flex-col gap-8 md:gap-40 lg:flex-row">
              <div className="flex flex-col gap-5">
                <p>
                  <span className="font-semibold">Population: </span>
                  <span className="font-light">
                    {country.population?.toLocaleString()}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Region: </span>
                  <span>{country.region}</span>
                </p>

                <p>
                  <span className="font-semibold">Sub Region: </span>
                  <span>{country.subregion}</span>
                </p>

                <p>
                  <span className="font-semibold">Capital: </span>
                  <span>{country.capital}</span>
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <p>
                  <span className="font-semibold">Top Level Domain: </span>
                  <span>{country.tld}</span>
                </p>

                <p>
                  <span className="font-semibold">Currencies: </span>
                  <span className="font-thin">{currencies}</span>
                </p>

                <p>
                  <span className="font-semibold">Languages: </span>
                  <span className="font-thin">{languages}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Country;
