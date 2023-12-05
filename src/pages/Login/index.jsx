import React, { useState } from "react";
import axios from "axios";

import "./index.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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
        const jwt = data.jwt;
        localStorage.setItem("jwt", jwt);
        if (data.status === "Login Success") {
          if (data.role_id === 1) {
            window.location.href = "/admin-dashboard";
          } else if (data.role_id === 2) {
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
      <div className="login-container flex column center gap ">
        <h2 className="txt-xl">Login</h2>
        <form onSubmit={handleSubmit} className="login-form flex column">
          <div className="flex column gap right">
            <div>
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

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
