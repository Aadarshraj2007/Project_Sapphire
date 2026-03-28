import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await API.get("/auth/approval-status");
      setStatus(res.data);
    };

    fetchStatus();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl">User Dashboard</h1>

      {status && (
        <div className="mt-4">
          <p>Email: {status.email}</p>
          <p>Role: {status.role}</p>
          <p>
            Status:{" "}
            {status.approved ? "✅ Approved" : "⏳ Pending Approval"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;