import { useContext, useCallback } from "react";
import { AuthContext } from "../auth.context";
import {
  login,
  register,
  logout,
  get_me,
  googleLogin,
} from "../services/auth.api";
import { useEffect } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      const data = await login({ email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(
    async (credential) => {
      try {
        setLoading(true);

        const data = await googleLogin(credential);

        setUser(data.user);

        return data;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser],
  );

  const handleRegister = async ({ username, email, password }) => {
    try {
      setLoading(true);
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    handleLogin,
    handleGoogleLogin,
    handleRegister,
    handleLogout,
  };
};
