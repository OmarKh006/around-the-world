const CountryCard = ({ name, population, region, capital, flag }) => {
  return (
    <a href="#">
      <div className="h-full rounded bg-gray-50 p-3 pb-9 shadow-md lg:w-66 dark:bg-gray-800">
        <img
          className="mb-4 h-40 w-full rounded-md"
          src={flag}
          alt="placeholder"
          loading="lazy"
          width="264px"
          height="180px"
        />

        <h2 className="mb-4 ml-3 text-lg font-extrabold">{name}</h2>

        <div className="ml-3 flex flex-col gap-2">
          <p>
            <span className="font-semibold">Population: </span>
            <span className="font-light">{population}</span>
          </p>

          <p>
            <span className="font-semibold">Region: </span>
            <span className="font-light">{region}</span>
          </p>

          <p>
            <span className="font-semibold">Capital: </span>
            <span className="font-light">{capital}</span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default CountryCard;
