import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../api/api";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  status: "New",
  notes: "",
};

// Leads page mirrors the Customers CRUD flow with lead-specific filters.
function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingLead, setEditingLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    // Search, status, and source are sent as query params for backend filtering.
    const params = new URLSearchParams({ page, limit: 8 });
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (source) params.set("source", source);

    try {
      const result = await apiRequest(`/leads?${params}`);
      setLeads(result.data.leads);
      setMeta(result.meta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, source]);

  useEffect(() => {
    // Debounce table refreshes while the user types in the search field.
    const timer = setTimeout(loadLeads, 300);
    return () => clearTimeout(timer);
  }, [loadLeads]);

  useEffect(() => {
    if (!message) return;

    // Success alerts are temporary, but users can also dismiss them manually.
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  // Reset form state before opening the add-lead modal.
  const openCreateModal = () => {
    setEditingLead(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  // Copy the selected row into form state before editing.
  const openEditModal = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || "",
      source: lead.source,
      status: lead.status,
      notes: lead.notes || "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Create and update share a form; the selected lead decides the method.
      const endpoint = editingLead ? `/leads/${editingLead._id}` : "/leads";
      const method = editingLead ? "PUT" : "POST";
      const result = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(form),
      });

      setMessage(result.message);
      setModalOpen(false);
      await loadLeads();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLead = async (lead) => {
    // Destructive action is restricted in the UI to admin users below.
    if (!window.confirm(`Delete ${lead.name}?`)) return;

    try {
      const result = await apiRequest(`/leads/${lead._id}`, {
        method: "DELETE",
      });
      setMessage(result.message);
      loadLeads();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Sales pipeline</p>
          <h1>Leads</h1>
          <p>Track opportunities from first contact to conversion.</p>
        </div>
        <button className="primary-button" onClick={openCreateModal}>
          Add lead
        </button>
      </div>

      {message && (
        <div className="alert alert-success dismissible-alert">
          <span>{message}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            x
          </button>
        </div>
      )}
      {error && !modalOpen && <div className="alert alert-error">{error}</div>}

      <section className="panel table-panel">
        <div className="filters filters-three">
          <input
            className="search-input"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search leads"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
          </select>
          <select
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All sources</option>
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Facebook">Facebook</option>
            <option value="Forms">Forms</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <strong>No leads found</strong>
            <p>Add your first lead or change the filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div className="person-cell">
                          <span>{lead.name.charAt(0).toUpperCase()}</span>
                          <div>
                            <strong>{lead.name}</strong>
                            <small>{lead.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{lead.company || "Not added"}</td>
                      <td>{lead.source}</td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => openEditModal(lead)}>
                            Edit
                          </button>
                          {/* Only admins can delete records from this screen. */}
                          {user.role === "admin" && (
                            <button
                              className="danger-text"
                              onClick={() => deleteLead(lead)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={meta} onPageChange={setPage} />
          </>
        )}
      </section>

      {modalOpen && (
        <Modal
          title={editingLead ? "Edit lead" : "Add lead"}
          onClose={() => setModalOpen(false)}
        >
          <form className="record-form" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-grid">
              <label>
                Full name 
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  maxLength="100"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  pattern="[0-9+().\-\s]{7,20}"
                  title="Enter a valid phone number"
                  required
                />
              </label>
              <label>
                Company
                <input
                  value={form.company}
                  onChange={(event) =>
                    setForm({ ...form, company: event.target.value })
                  }
                  maxLength="100"
                />
              </label>
              <label>
                Source
                <select
                  value={form.source}
                  onChange={(event) =>
                    setForm({ ...form, source: event.target.value })
                  }
                >
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Forms">Forms</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                </select>
              </label>
              <label className="full-field">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm({ ...form, notes: event.target.value })
                  }
                  maxLength="2000"
                  rows="4"
                />
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button className="primary-button" disabled={submitting}>
                {submitting ? "Saving..." : "Save lead"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Leads;
