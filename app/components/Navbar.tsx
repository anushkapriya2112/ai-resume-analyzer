import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
        RESUMIND
      </Link>

      <Link to="/upload" className="primary-button !w-auto !py-2 !px-5 text-sm">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;