import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { PgProvider } from "./features/pg/pg.context.jsx";
const App = () => {
  return (
    <AuthProvider>
      <PgProvider>
        <RouterProvider router={router} />
      </PgProvider>
    </AuthProvider>
  )
}

export default App
