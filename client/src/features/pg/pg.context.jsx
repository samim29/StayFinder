/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const PgContext = createContext();

/**
 * @description Provides shared PG listing state for owner listing pages.
 */
export const PgProvider = ({ children }) => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <PgContext.Provider value={{ pgs, setPgs, loading, setLoading }}>
      {children}
    </PgContext.Provider>
  );
};
