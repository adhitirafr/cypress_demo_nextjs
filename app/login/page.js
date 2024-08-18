"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginData } from "store/reducers/user.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "../login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and Password must be filled");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      //-- add user reducers
      dispatch(loginData({ email, password }))
        .unwrap()
        .then((response) => {
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));

          router.push("/dashboard");
        })
        .catch((err) => {
          setError(err.message || "email or password is wrong");
        });
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="Email"
              data-cy="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              data-cy="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            id="submitlogin"
            data-cy="submit"
            type="submit"
            className="btn btn-primary w-100"
          >
            Log In
          </button>

          {error && (
            <div id="error" className="alert alert-danger mt-3">
              {error}
              <button
                type="button"
                onClick={handleCloseError}
                className="btn-close float-end"
              ></button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
