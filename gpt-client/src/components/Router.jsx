import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { getAccessToken } from "../lib/utils";

const isAuthenticated = () => {
  return !!getAccessToken();
};

const ProtectedRoute = ({ isAuth }) => {
  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};

const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <ProtectedRoute isAuth={isAuthenticated()} />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

export default Router;
