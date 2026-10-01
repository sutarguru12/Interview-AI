import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="protected-shell">
      <button type="button" className="logout-button" onClick={onLogout}>
        Logout
      </button>
      {children}
    </div>
  );
};

export default Protected;
