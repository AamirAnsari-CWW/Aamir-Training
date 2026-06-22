import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiRequest } from "../api/api";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

const emptyStats = {
  customers: { total: 0, active: 0, inactive: 0 },
  leads: { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0 },
};

// Dashboard summarizes CRM activity and converts the API totals into chart data.
function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // The dashboard endpoint returns aggregated customer and lead counts.
    apiRequest("/dashboard")
      .then((result) => setStats(result.data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Recharts expects arrays, so map the summary object into stage records.
  const leadPipelineData = [
    { stage: "New", leads: stats.leads.new, color: "#7c3aed" },
    { stage: "Contacted", leads: stats.leads.contacted, color: "#f59e0b" },
    { stage: "Qualified", leads: stats.leads.qualified, color: "#8b5cf6" },
    { stage: "Converted", leads: stats.leads.converted, color: "#10b981" },
  ];

  // Customer health is represented as a donut chart plus exact counts.
  const customerHealthData = [
    { name: "Active", value: stats.customers.active, color: "#10b981" },
    { name: "Inactive", value: stats.customers.inactive, color: "#f59e0b" },
  ];

  return (
    <div>
      
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p>Here is what is happening in your CRM, {user.name}.</p>
        </div>
        <Link to="/customers" className="primary-button">
          Add customer
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card stat-blue">
          <div className="stat-icon">C</div>
          <div>
            <span>Total customers</span>
            <strong>{stats.customers.total}</strong>
            <small>{stats.customers.active} active</small>
          </div>
        </article>
        <article className="stat-card stat-green">
          <div className="stat-icon">A</div>
          <div>
            <span>Active customers</span>
            <strong>{stats.customers.active}</strong>
            <small>{stats.customers.inactive} inactive</small>
          </div>
        </article>
        <article className="stat-card stat-purple">
          <div className="stat-icon">L</div>
          <div>
            <span>Total leads</span>
            <strong>{stats.leads.total}</strong>
            <small>{stats.leads.new} new leads</small>
          </div>
        </article>
        <article className="stat-card stat-orange">
          <div className="stat-icon">S</div>
          <div>
            <span>Converted leads</span>
            <strong>{stats.leads.converted}</strong>
            <small>Successfully converted</small>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Lead pipeline</h2>
              <p>Current progress across lead stages</p>
            </div>
            <Link to="/leads">View leads</Link>
          </div>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={leadPipelineData}
                margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
              >
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(124, 58, 237, 0.08)" }} />
                <Bar dataKey="leads" radius={[8, 8, 0, 0]}>
                  {leadPipelineData.map((item) => (
                    <Cell key={item.stage} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-summary">
            {leadPipelineData.map((item) => (
              <span key={item.stage}>
                <i style={{ background: item.color }} />
                {item.stage}: {item.leads}
              </span>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Customer health</h2>
              <p>Active and inactive customers</p>
            </div>
          </div>

          <div className="customer-health customer-health-chart">
            <div className="chart-box donut-box">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={customerHealthData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={86}
                    // paddingAngle={stats.customers.total > 0 ? 4 : 0}
                  >
                    {customerHealthData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <strong>{stats.customers.total}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="health-list">
              <div>
                <span className="health-dot active-dot" />
                <span>Active</span>
                <strong>{stats.customers.active}</strong>
              </div>
              <div>
                <span className="health-dot inactive-dot" />
                <span>Inactive</span>
                <strong>{stats.customers.inactive}</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="quick-actions">
        <h2>Quick actions</h2>
        <div>
          <Link to="/customers">Manage customers</Link>
          <Link to="/leads">Track leads</Link>
          <Link to="/email">Send an email</Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
