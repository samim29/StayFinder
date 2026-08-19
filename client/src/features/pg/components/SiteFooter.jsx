const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-brand">
      <span className="brand-mark">SF</span>
      <strong>StayFinder</strong>
      <p>Find a room that feels like home.</p>
    </div>
    <div className="site-footer-links">
      <a href="/how-it-works">How it works</a>
    </div>
    <small>
      © {new Date().getFullYear()} StayFinder. Built for better moves.
    </small>
  </footer>
);

export default SiteFooter;
