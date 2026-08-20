const LoadingButtonContent = ({ loading, loadingLabel, children }) => loading ? <><span className="button-spinner" aria-hidden="true" />{loadingLabel}</> : children;
export default LoadingButtonContent;
