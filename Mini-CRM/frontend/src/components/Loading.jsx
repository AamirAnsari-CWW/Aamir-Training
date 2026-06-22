// Shared loading indicator. fullPage is used during the initial auth check.
function Loading({ fullPage = false }) {
  return (
    <div className={fullPage ? "loading full-page-loading" : "loading"}>
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
}

export default Loading;
