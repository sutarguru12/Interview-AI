import React from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [error, setError] = useState("");

  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    try {
      await handleLogin({ email, password });
      Navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        setError(
          error.response?.data?.message ||
            "Too many requests, Please try again later.",
        );
      } else {
        setError(
          error.response?.data?.message || "Wrong credentials, Please re-enter",
        );
      }
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="GuruSutar@gmail.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="button primary-button">Login</button>
        </form>

        <p>
          Don't have an account? <Link to={"/Register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
