import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

// Register creates a user account and signs the user in after success.
function Register() {
  const { register } = useAuth();

  // These fields map directly to the registration API payload.
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Keep the simple password rule on the client so users get instant feedback
  // before the request is sent.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <div className="auth-brand">
          <span className="brand-mark">M</span>
          <strong>Mini CRM</strong>
        </div>

        <div>
          <p className="eyebrow">Start organized</p>
          <h1>Build one reliable place for your customer work.</h1>
          <p>
            Create your workspace to track customers, manage new leads, and
            follow up with the right people at the right time.
          </p>
        </div>

        <div className="intro-points">
          <span>Customer directory</span>
          <span>Lead status updates</span>
          <span>Email communication</span>
        </div>
      </section>

      <section className="auth-form-side">
        {/* Registration form: controlled inputs make validation and API
            submission predictable. */}
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="muted-text">
            Start your workspace and keep customer work moving from day one.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <label>
            Full name *
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              maxLength="100"
              required
            />
          </label>

          <label>
            Email *
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password *
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <span className="field-help">
            Use 8 or more characters.
          </span>

          <button
            className="primary-button full-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="form-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
