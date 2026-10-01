import React from "react";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      await handleRegister({ username, email, password });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration.",
      );
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
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="username"
              id="username"
              name="username"
              placeholder="Guru Sutar"
            />
          </div>
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

          <button className="button primary-button">Register</button>
        </form>

        <p>
          Already have an account? <Link to={"/Login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
