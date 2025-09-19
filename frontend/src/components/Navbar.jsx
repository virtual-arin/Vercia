import React from "react";
import { Link as RouterLink } from "react-router-dom";
import "./navbar.css";
import verciaLogo from "../assets/vercel.png";

const Navbar = () => {
  return (
    <nav>
      <div>
        <RouterLink to="/">
          <img src={verciaLogo} alt="logo" />
        </RouterLink>
        <RouterLink to="/">
          <h3>Vercia</h3>
        </RouterLink>
      </div>
      <div>
        <RouterLink to="/create">
          <p>Create a Repository</p>
        </RouterLink>
        <RouterLink to="/profile">
          <p>Profile</p>
        </RouterLink>
      </div>
    </nav>
  );
};

export default Navbar;
