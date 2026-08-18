import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/login";
import PgForm from "./features/pg/pages/PgForm";
import OwnerRoute from "./features/auth/components/OwnerRoute";
import Home from "./features/pg/pages/Home";
import SearchResults from "./features/pg/pages/SearchResults";
import PgDetails from "./features/pg/pages/PgDetails";
import DashboardEntry from "./features/pg/pages/DashboardEntry";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/browse",
    element: <SearchResults />,
  },
  {
    path: "/pg/:pgId",
    element: <PgDetails />,
  },
  {
    path: "/dashboard",
    element: <DashboardEntry />,
  },
  {
    element: <OwnerRoute />,
    children: [
      { path: "/listings/new", element: <PgForm /> },
      { path: "/listings/:pgId/edit", element: <PgForm /> },
    ],
  },
]);


