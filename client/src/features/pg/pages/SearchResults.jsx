import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DiscoveryHeader from "../components/DiscoveryHeader";
import PgCard from "../components/PgCard";
import PgFilters from "../components/PgFilters";
import PgMap from "../components/PgMap";
import { usePg } from "../hooks/usePg";
import "../discovery.scss";
import LoadingState from "../../../components/LoadingState";

const initialFilters = {
  minRent: "",
  maxRent: "",
  roomTypes: [],
  amenities: [],
  availableBeds: true,
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pgs, loading, handleSearchPgs } = usePg();
  const [filters, setFilters] = useState(initialFilters);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [selectedId, setSelectedId] = useState("");
  const [searchError, setSearchError] = useState("");
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  const params = useMemo(
    () => ({
      q: q || undefined,
      minRent: filters.minRent || undefined,
      maxRent: filters.maxRent || undefined,
      roomTypes: filters.roomTypes.length
        ? filters.roomTypes.join(",")
        : undefined,
      amenities: filters.amenities.length
        ? filters.amenities.join(",")
        : undefined,
      availableBeds: filters.availableBeds ? 1 : undefined,
      lat: searchParams.get("lat") || undefined,
      lng: searchParams.get("lng") || undefined,
      radius: 25000,
      page,
      limit: 10,
    }),
    [filters, page, q, searchParams],
  );

  useEffect(() => {
    handleSearchPgs(params)
      .then(setMeta)
      .catch((error) => {
        setSearchError(
          error.response?.data?.message || "Search is temporarily unavailable.",
        );
        setMeta({ total: 0, page, totalPages: 1 });
      });
    // The context action is intentionally excluded because it is recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    setSearchParams(next);
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Location services are not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const next = new URLSearchParams(searchParams);
        next.set("lat", coords.latitude);
        next.set("lng", coords.longitude);
        next.delete("page");
        setSearchParams(next);
      },
      () =>
        setSearchError(
          "We could not access your location. Check browser permissions.",
        ),
    );
  };

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", nextPage);
    setSearchParams(next);
  };

  return (
    <>
      <DiscoveryHeader />
      <main className="results-page">
        <aside className="results-sidebar">
          <PgFilters
            value={filters}
            onChange={setFilters}
            onApply={applyFilters}
            onClear={clearFilters}
          />
          <button
            type="button"
            className="location-button"
            onClick={useLocation}
          >
            ⌖ Use my location
          </button>
          <p className="map-legend">
            <span className="legend-user" /> Your location
            <br />
            <span className="legend-pg" /> PG location
          </p>
        </aside>
        <section className="results-list">
          <div className="results-heading">
            <div>
              <p className="kicker">Search results</p>
              <h1>
                {meta.total} PGs{q && ` near ${q}`}
              </h1>
            </div>
            <span>Sorted: Nearest</span>
          </div>
          {searchError && <div className="page-error">{searchError}</div>}
          {loading ? (
            <LoadingState label="Finding suitable PGs" />
          ) : pgs.length ? (
            <>
              {pgs.map((pg) => (
                <PgCard key={pg._id} pg={pg} />
              ))}
              <div className="pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {meta.totalPages || 1}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => changePage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            !searchError && (
              <div className="page-state">
                No PGs match these filters. Try widening your search.
              </div>
            )
          )}
        </section>
        <PgMap
          pgs={pgs}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            document
              .getElementById(`pg-${id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      </main>
    </>
  );
};

export default SearchResults;
