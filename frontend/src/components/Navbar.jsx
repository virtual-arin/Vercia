import React from "react";
import { Link } from "react-router-dom";
import verciaLogo from "../assets/vercia.png";

const Navbar = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <nav className="px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1">
              <img className="h-8 w-auto" src={verciaLogo} alt="Vercia logo" />
              <span className="text-white text-3xl font-bold">Vercia</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-sm font-medium"
            >
              Create Repository
            </Link>
            <Link
              to="/profile"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-1 rounded-md text-sm font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
