const CountryCard = () => {
  return (
    <a href="#">
      <div className="h-full rounded bg-gray-50 p-3 pb-9 shadow-md lg:w-66 dark:bg-gray-800">
        <img
          className="mb-4 h-40 w-full rounded-md"
          src="https://placehold.co/264x180"
          alt="placeholder"
          loading="lazy"
        />

        <h2 className="mb-4 ml-3 text-lg font-extrabold">Egypt</h2>

        <div className="ml-3 flex flex-col gap-2">
          <p>
            <span className="font-semibold">Population: </span>
            <span className="font-light">1000</span>
          </p>

          <p>
            <span className="font-semibold">Region: </span>
            <span className="font-light">Africa</span>
          </p>

          <p>
            <span className="font-semibold">Capital: </span>
            <span className="font-light">Cairo</span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default CountryCard;
