import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://nesto-backend-production-623a.up.railway.app/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Users: {stats.users}</p>
    </div>
  );
}