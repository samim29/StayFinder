import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/login";
import PgForm from "./features/pg/pages/PgForm";
import OwnerRoute from "./features/auth/components/OwnerRoute";
import Home from "./features/pg/pages/Home";
import SearchResults from "./features/pg/pages/SearchResults";
import PgDetails from "./features/pg/pages/PgDetails";
import DashboardRoute from "./features/pg/pages/DashboardRoute";
import OwnerDashboard from "./features/pg/pages/OwnerDashboard";
import StudentRoute from "./features/auth/components/StudentRoute";
import BookingPage from "./features/booking/pages/BookingPage";
import StudentDashboard from "./features/booking/pages/StudentDashboard";
import OwnerBookingRequests from "./features/booking/pages/OwnerBookingRequests";
import PublicOnlyRoute from "./features/auth/components/PublicOnlyRoute";
import RouteErrorPage from "./features/auth/pages/RouteErrorPage";
import OwnerProfile from "./features/pg/pages/OwnerProfile";
import StudentProfile from "./features/booking/pages/StudentProfile";
import HowItWorks from "./features/pg/pages/HowItWorks";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <PublicOnlyRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    path: "/browse",
    element: <SearchResults />,
    errorElement: <RouteErrorPage />,
  },
  { path: "/how-it-works", element: <HowItWorks />, errorElement: <RouteErrorPage /> },
  {
    path: "/pg/:pgId",
    element: <PgDetails />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <OwnerDashboard /> },
      { path: "requests", element: <OwnerBookingRequests /> },
      { path: "new", element: <PgForm /> },
      { path: "profile", element: <OwnerProfile /> },
    ],
  },
  {
    element: <StudentRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/booking/new/:pgId", element: <BookingPage /> },
      { path: "/bookings", element: <StudentDashboard /> },
      { path: "/student/profile", element: <StudentProfile /> },
    ],
  },
  {
    element: <OwnerRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/listings/new", element: <PgForm /> },
      { path: "/listings/:pgId/edit", element: <PgForm /> },
    ],
  },
]);
