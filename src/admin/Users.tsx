import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await axios.get(
      "https://nesto-backend-production-623a.up.railway.app/api/admin/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(res.data);
  };

  const deleteUser = async (id: number) => {
    await axios.delete(
      `https://nesto-backend-production-623a.up.railway.app/api/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map((u) => (
        <div key={u.id} style={{ marginBottom: 10 }}>
          {u.email} ({u.role})
          <button onClick={() => deleteUser(u.id)} style={{ marginLeft: 10 }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}