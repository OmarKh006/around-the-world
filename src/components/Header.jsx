import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="mb-6 bg-white shadow dark:bg-gray-800 md:mb-12">
      <div className="container mx-auto px-5 md:px-0">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
