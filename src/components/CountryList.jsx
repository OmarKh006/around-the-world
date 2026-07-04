import CountryCard from "./CountryCard";

const CountryList = () => {
  return (
    <div className="mt-8 grid justify-between gap-x-17.5 gap-y-12 md:mt-12 md:grid-cols-[repeat(2,minmax(0,auto))] lg:grid-cols-[repeat(4,minmax(0,auto))] lg:gap-y-17.5">
      <CountryCard />
      <CountryCard />
      <CountryCard />
      <CountryCard />
    </div>
  );
};

export default CountryList;
