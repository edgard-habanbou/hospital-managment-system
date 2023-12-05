import React from "react";
import { Link } from "react-router-dom";
const Nav = ({ onCalendarClick, onPatientsClick }) => {
  const logout = () => {
    localStorage.removeItem("jwt");
  };
  return (
    <nav className="navbar">
      <ul className="nav-list flex row space-between">
        <div className="flex gap">
          <li className="nav-item">
            <Link to="/doctor-dashboard" onClick={onPatientsClick}>
              Patients
            </Link>
          </li>
          <li className="nav-item ">
            <Link to="/doctor-dashboard" onClick={onCalendarClick}>
              Calendar
            </Link>
          </li>
        </div>
        <div>
          <li className="nav-item danger">
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Nav;
