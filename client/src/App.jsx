import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PgProvider } from "./features/pg/pg.context.jsx";
import { BookingProvider } from "./features/booking/booking.context.jsx";
import SiteFooter from "./features/pg/components/SiteFooter.jsx";
const App = () => {
  return (
    <AuthProvider>
      <PgProvider>
        <BookingProvider>
          <RouterProvider router={router} />
          <SiteFooter />
        </BookingProvider>
      </PgProvider>
    </AuthProvider>
  );
};

export default App;
