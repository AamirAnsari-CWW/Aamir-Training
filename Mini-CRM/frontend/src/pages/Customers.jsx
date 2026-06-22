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
  status: "Active",
};

// Customers page handles listing, filtering, pagination, and create/edit/delete.
function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    // Build query params from the current filter state before requesting data.
    const params = new URLSearchParams({ page, limit: 8 });
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);

    try {
      const result = await apiRequest(`/customers?${params}`);
      setCustomers(result.data.customers);
      setMeta(result.meta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    // Debounce search/filter changes so typing does not call the API every key.
    const timer = setTimeout(loadCustomers, 300);
    return () => clearTimeout(timer);
  }, [loadCustomers]);

  useEffect(() => {
    if (!message) return;

    // Success alerts are temporary, but users can also dismiss them manually.
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  // Create mode uses a blank form and no editing record.
  const openCreateModal = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  // Edit mode hydrates the form from the selected customer row.
  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || "",
      status: customer.status,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Reuse the same form for create and update; only endpoint/method changes.
      const endpoint = editingCustomer
        ? `/customers/${editingCustomer._id}`
        : "/customers";
      const method = editingCustomer ? "PUT" : "POST";

      const result = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(form),
      });

      setMessage(result.message);
      setModalOpen(false);
      await loadCustomers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCustomer = async (customer) => {
    // Destructive action is restricted in the UI to admin users below.
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    try {
      const result = await apiRequest(`/customers/${customer._id}`, {
        method: "DELETE",
      });
      setMessage(result.message);
      loadCustomers();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">People</p>
          <h1>Customers</h1>
          <p>Store and manage your customer information.</p>
        </div>
        <button className="primary-button" onClick={openCreateModal}>
          Add customer
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
        <div className="filters">
          <input
            className="search-input"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, phone, or company"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <strong>No customers found</strong>
            <p>Add your first customer or change the filters.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="person-cell">
                          <span>{customer.name.charAt(0).toUpperCase()}</span>
                          <strong>{customer.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="table-main-text">{customer.email}</span>
                        <small>{customer.phone}</small>
                      </td>
                      <td>{customer.company || "Not added"}</td>
                      <td>
                        <StatusBadge status={customer.status} />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => openEditModal(customer)}>
                            Edit
                          </button>
                          {/* Only admins can delete records from this screen. */}
                          {user.role === "admin" && (
                            <button
                              className="danger-text"
                              onClick={() => deleteCustomer(customer)}
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
          title={editingCustomer ? "Edit customer" : "Add customer"}
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
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                {submitting ? "Saving..." : "Save customer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Customers;
