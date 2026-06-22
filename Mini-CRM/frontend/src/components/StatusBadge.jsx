// Maps a CRM status value to a matching CSS class, such as status-active.
function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}

export default StatusBadge;
