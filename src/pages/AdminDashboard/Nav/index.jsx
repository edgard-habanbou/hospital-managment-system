import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
const Nav = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list flex row gap">
        <li className="nav-item">
          <Link to="/admin-dashboard">Doctors</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-dashboard">Patients</Link>
        </li>
        <li className="nav-item">
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
