import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approve = async (id, approve) => {
    await API.post("/auth/approve", { userId: id, approve });
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Supreme Admin Dashboard</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Approved</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.approved ? "Yes" : "No"}</td>
              <td>
                {!u.approved && (
                  <>
                    <button
                      className="btn"
                      onClick={() => approve(u.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-red ml-2"
                      onClick={() => approve(u.id, false)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;