// Renders table pagination only when the backend reports multiple pages.
function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={meta.page <= 1}
      >
        Previous
      </button>
      <span>
        Page {meta.page} of {meta.totalPages}
      </span>
      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={meta.page >= meta.totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
