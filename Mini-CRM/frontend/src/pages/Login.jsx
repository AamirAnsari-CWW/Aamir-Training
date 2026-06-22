import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

// Login collects credentials and delegates session setup to AuthContext.
function Login() {
  const { login } = useAuth();

  // Local form state keeps the email and password inputs controlled.
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Submit the credentials through AuthContext so token storage and redirects stay in one place.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
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
          <p className="eyebrow">Smart CRM</p>
          <h1>Stay on top of every customer, lead, and follow-up.</h1>
          <p>
            Sign in to manage your pipeline, update records, and keep customer
            conversations moving without extra clutter.
          </p>
        </div>
        <div className="intro-points">
          <span>Clear customer records</span>
          <span>Simple lead tracking</span>
          <span>Quick email follow-ups</span>
        </div>
      </section>

      <section className="auth-form-side">
        {/* Authentication form: validates browser-required fields first, then
            lets the backend handle account-specific errors. */}
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="muted-text">
            Sign in to continue managing your pipeline and customer activity.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

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
                placeholder="Enter your password"
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
          <button className="primary-button full-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="form-link">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
