import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
const Nav = ({ onDoctorsClick, onPatientClick }) => {
  return (
    <nav className="navbar">
      <ul className="nav-list flex row space-between">
        <div className="flex gap">
          <li className="nav-item">
            <Link to="/admin-dashboard" onClick={onDoctorsClick}>
              Doctors
            </Link>
          </li>
          <li className="nav-item ">
            <Link to="/admin-dashboard" onClick={onPatientClick}>
              Patients
            </Link>
          </li>
        </div>
        <div>
          <li className="nav-item danger">
            <Link to="/">Logout</Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Nav;
