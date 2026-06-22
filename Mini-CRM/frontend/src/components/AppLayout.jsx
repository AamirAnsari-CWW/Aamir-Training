import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// Sidebar route config. Add new protected pages here so navigation stays in one place.
const navigation = [
  { path: "/", label: "Dashboard", icon: "D" },
  { path: "/customers", label: "Customers", icon: "C" },
  { path: "/leads", label: "Leads", icon: "L" },
  { path: "/email", label: "Send Email", icon: "E" },
];

function AppLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* The sidebar is fixed on desktop and slides in on smaller screens. */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">M</span>
          <div>
            <strong>Mini CRM</strong>
            <small>Customer workspace</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
          <button className="logout-button" onClick={logout} title="Log out">
            Log out
          </button>
        </div>
      </aside>

      {/* Overlay closes the mobile menu when users tap outside the sidebar. */}
      {menuOpen && (
        <button
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
          <div>
            <span className="welcome-text">Welcome back,</span>
            <strong>{user.name}</strong>
          </div>
        </header>

        <main className="page-content">
          {/* Child routes render here: dashboard, customers, leads, or email. */}
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
