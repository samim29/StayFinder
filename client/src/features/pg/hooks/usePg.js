import { useContext } from "react";
import { PgContext } from "../pg.context.jsx";
import { createPg, deletePg, getMyPgs, getPg, updatePg, uploadPgImage } from "../services/pg.api.js";

/**
 * @description Provides PG listing state and owner listing actions.
 */
export const usePg = () => {
  const context = useContext(PgContext);

  if (!context) {
    throw new Error("usePg must be used inside PgProvider");
  }

  const { pgs, setPgs, loading, setLoading } = context;

  const handleGetPg = async (pgId) => {
    setLoading(true);
    try {
      return await getPg(pgId);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMyPgs = async () => {
    setLoading(true);
    try {
      const data = await getMyPgs();
      setPgs(data.pgs);
      return data.pgs;
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePg = async (pgData) => {
    setLoading(true);
    try {
      const data = await createPg(pgData);
      setPgs((currentPgs) => [data.pg, ...currentPgs]);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePg = async (pgId, pgData) => {
    setLoading(true);
    try {
      const data = await updatePg(pgId, pgData);
      setPgs((currentPgs) => currentPgs.map((pg) => (pg._id === pgId ? data.pg : pg)));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePg = async (pgId) => {
    setLoading(true);
    try {
      await deletePg(pgId);
      setPgs((currentPgs) => currentPgs.filter((pg) => pg._id !== pgId));
    } finally {
      setLoading(false);
    }
  };

  return { pgs, loading, handleGetPg, handleGetMyPgs, handleCreatePg, handleUpdatePg, handleDeletePg, uploadPgImage };
};
