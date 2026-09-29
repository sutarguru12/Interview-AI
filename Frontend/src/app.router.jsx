import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Home from "./features/ai/pages/Home";
import Interview from "./features/ai/pages/interview";
import Protected from "./features/auth/components/protected";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
]);
