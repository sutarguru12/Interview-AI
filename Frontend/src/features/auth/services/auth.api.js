import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 429) {
      console.log(
        error.response?.data?.message ||
          "Too many requests, Please try again later",
      );
    }
    return Promise.reject(error);
  },
);

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", { email, password });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const googleLogin = async (credential) => {
  const response = await api.post(
    `/api/auth/google`,
    {
      credential,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export async function logout({ token }) {
  try {
    const response = await api.post("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function get_me() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
