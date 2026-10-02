import React from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const Login = () => {
  const { loading, handleLogin, handleGoogleLogin } = useAuth();
  const [error, setError] = useState("");

  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    if (loading) return;

    let interval;

    const initializeGoogleLogin = () => {
      if (!window.google) {
        console.log("Google identity services not loaded yet..");
        return false;
      }

      const googleButton = document.getElementById("googleButton");

      if (!googleButton) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

        callback: async (response) => {
          try {
            setGoogleLoading(true);
            setGoogleError("");

            const data = await handleGoogleLogin(response.credential);

            console.log("Google login successful", data.user);

            Navigate("/");
          } catch (error) {
            console.log("Google login failed: ", error);

            setGoogleError(
              error.response?.data?.message || "Google login failed",
            );
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      googleButton.innerHTML = "";

      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 350,
      });
      return true;
    };
    if (window.google) {
      initializeGoogleLogin();
      return;
    }
    interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initializeGoogleLogin();
      }
    }, 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [Navigate, handleGoogleLogin, loading]);

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

          <div className="google-login">
            <p>OR</p>

            {googleLoading && <p>Sign in with google.</p>}
            <div id="googleButton"></div>

            {googleError && <p className="error-message">{googleError}</p>}
          </div>
        </form>

        <p>
          Don't have an account? <Link to={"/Register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
