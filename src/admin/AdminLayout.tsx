import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
        <h2>Admin</h2>
        <nav>
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/admin/users">Users</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}