import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Email from "./pages/Email";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Keeps logged-in users away from the login/register pages.
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <Routes>
      {/* Public authentication pages. */}
      <Route path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected CRM pages share the sidebar/topbar layout. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="leads" element={<Leads />} />
          <Route path="email" element={<Email />} />
        </Route>
      </Route>

      {/* Unknown routes fall back to the dashboard or login, based on auth. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
