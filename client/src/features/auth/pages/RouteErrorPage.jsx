import { Link, useRouteError } from "react-router-dom";
import DiscoveryHeader from "../../pg/components/DiscoveryHeader";

const RouteErrorPage = () => {
  const error = useRouteError();
  const message =
    error?.statusText ||
    error?.message ||
    "Something went wrong while loading this page.";

  return (
    <>
      <DiscoveryHeader />
      <main className="page-error-screen">
        <h1>We hit a snag</h1>
        <p>{message}</p>
        <Link to="/">Return home</Link>
      </main>
    </>
  );
};

export default RouteErrorPage;
