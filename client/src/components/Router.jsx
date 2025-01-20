import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useSelector } from "react-redux";


const ProtectedRoute = () => {
  const isAuth = useSelector(state=>state.user.isAuth)
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
    element: <ProtectedRoute  />,
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
