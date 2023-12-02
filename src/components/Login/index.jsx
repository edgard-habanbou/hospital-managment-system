import React, { useState } from "react";
import axios from "axios";
import "./index.css"; // Import the CSS file
import { json } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", email);
    console.log("Password:", password);

    axios
      .post(
        "http://localhost/hospital-managment-system/backend/api/auth/signin.php",
        {
          user_email: email,
          user_password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        if (data.status === "Login Success") {
          if (data.role === 1) {
            window.location.href = "/admin-dashboard";
          } else if (data.role === 2) {
            window.location.href = "/doctor-dashboard";
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex center full-height full-width">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </label>
          <br />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
