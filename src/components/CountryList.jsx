import CountryCard from "./CountryCard";

const CountryList = ({ data }) => {
  return (
    <div className="mt-8 grid justify-between gap-x-17.5 gap-y-12 md:mt-12 md:grid-cols-[repeat(2,minmax(0,auto))] lg:grid-cols-[repeat(4,minmax(0,auto))] lg:gap-y-17.5">
      {data.map((country) => {
        return (
          <CountryCard
            key={country.official}
            name={country.name}
            population={country.population}
            region={country.region}
            capital={country.capital}
            flag={country.flag}
          />
        );
      })}
    </div>
  );
};

export default CountryList;
