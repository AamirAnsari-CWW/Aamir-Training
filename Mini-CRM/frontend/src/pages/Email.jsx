import { useState } from "react";
import {
  FaCheckCircle,
  FaPaperPlane,
  FaRegEnvelope,
  FaRegFileAlt,
  FaUserCheck,
} from "react-icons/fa";

import { apiRequest } from "../api/api";

const emptyForm = { to: "", subject: "", message: "" };

// Email page sends one-off customer/lead messages through the backend mail API.
function Email() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const previewSubject = form.subject.trim() || "Your subject will appear here";
  // const previewMessage =form.message.trim() ||"Start writing your message to see a short preview here.";

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // The backend owns actual mail delivery; this page only validates and submits.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await apiRequest("/email/send", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(result.message);
      setForm(emptyForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Communication</p>
          <h1>Email composer</h1>
          <p>Send clear follow-ups to customers and leads from your CRM.</p>
        </div>
      </div>

      <div className="email-layout">
        <form className="panel email-form" onSubmit={handleSubmit}>
          <div className="email-compose-header">
            <span className="email-compose-icon">
              <FaRegEnvelope />
            </span>
            <div>
              <h2>New message</h2>
              <p>Write a focused message and send it directly from the CRM.</p>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="email-fields">
            <label>
              Recipient email
              <div className="email-input-wrap">
                <FaUserCheck />
                <input
                  type="email"
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  required
                />
              </div>
            </label>

            <label>
              Subject
              <div className="email-input-wrap">
                <FaRegFileAlt />
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Follow-up on our conversation"
                  maxLength="150"
                  required
                />
              </div>
            </label>
          </div>

          <label className="email-message-field">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Hi, I wanted to follow up on..."
              rows="12"
              maxLength="10000"
              required
            />
          </label>

          <div className="email-footer">
            <span>{form.message.length.toLocaleString()} / 10,000 characters</span>
            <button className="primary-button email-send-button" disabled={submitting}>
              <FaPaperPlane />
              {submitting ? "Sending..." : "Send email"}
            </button>
          </div>
        </form>

        <aside className="email-help">
          {/* <div className="email-preview panel">
            <p className="eyebrow">Preview</p>
            <h2>{previewSubject}</h2>
            <p>To: {form.to || "recipient@example.com"}</p>
            <div>{previewMessage}</div>
          </div> */}

          <div className="help-card">
            <span className="help-number">
              <FaCheckCircle />
            </span>
            <div>
              <strong>Confirm the recipient</strong>
              <p>Send to the right customer or lead before submitting.</p>
            </div>
          </div>
          <div className="help-card">
            <span className="help-number">
              <FaRegFileAlt />
            </span>
            <div>
              <strong>Keep the subject specific</strong>
              <p>Use a line that makes the follow-up easy to recognize.</p>
            </div>
          </div>
          <div className="help-card">
            <span className="help-number">
              <FaPaperPlane />
            </span>
            <div>
              <strong>Send with context</strong>
              <p>Mention the next step so the conversation keeps moving.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Email;
