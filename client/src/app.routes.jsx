import { Navigate, createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/login";
import PgForm from "./features/pg/pages/PgForm";
import OwnerDashboard from "./features/pg/pages/OwnerDashboard";
import OwnerRoute from "./features/auth/components/OwnerRoute";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <OwnerRoute />,
    children: [
      { path: "/dashboard", element: <OwnerDashboard /> },
      { path: "/listings/new", element: <PgForm /> },
      { path: "/listings/:pgId/edit", element: <PgForm /> },
    ],
  },
]);


