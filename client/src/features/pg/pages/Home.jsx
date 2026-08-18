import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscoveryHeader from "../components/DiscoveryHeader";
import PgCard from "../components/PgCard";
import { usePg } from "../hooks/usePg";
import "../discovery.scss";

const Home = () => {
  const navigate = useNavigate();
  const { pgs, handleSearchPgs } = usePg();
  const [query, setQuery] = useState("");

  useEffect(() => { handleSearchPgs({ limit: 2 }).catch(() => {}); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return <><DiscoveryHeader /><main className="home-page"><section className="hero-discovery"><div className="hero-copy"><p className="kicker">Boarding pass to your new city</p><h1>Land somewhere <em>that feels ready</em> for you.</h1><p className="hero-description">Search verified PGs near your campus, compare rent and amenities honestly, and lock in a bed before you have even packed your bags.</p><form className="home-search" onSubmit={(event) => { event.preventDefault(); navigate(`/browse${query ? `?q=${encodeURIComponent(query)}` : ""}`); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by college, area, or city — e.g. VIT Vellore" /><button type="submit">Find PGs</button></form><div className="home-stats"><span><strong>1,240+</strong>Verified PGs</span><span><strong>18</strong>Cities</span><span><strong>4.6★</strong>Avg. rating</span></div></div><div className="hero-ticket"><span className="ticket-image" /><div><strong>Sunrise Nest PG</strong><p>0.4 km from NIT Trichy · Boys</p><div className="card-tags"><span>WiFi</span><span>Laundry</span><span>Meals</span></div></div><aside><small>2 beds left</small><strong>₹7,500</strong><span>/ month</span></aside></div></section><section className="nearby-section"><p className="kicker">Nearby your campus</p><div className="nearby-grid">{pgs.map((pg) => <PgCard key={pg._id} pg={pg} compact />)}</div></section><section id="how-it-works" className="how-section"><p className="kicker">How it works</p><h2>Find your next room in three steps.</h2><div><article><b>01</b><h3>Search nearby</h3><p>Start with your campus, city, or preferred neighbourhood.</p></article><article><b>02</b><h3>Compare honestly</h3><p>See rent, beds, amenities, and distance in one place.</p></article><article><b>03</b><h3>Move with confidence</h3><p>Open the details page and contact the owner directly.</p></article></div></section></main></>;
};

export default Home;
