
import { useState, useEffect } from "react";
import Applications from "./applications";
import ManageJobs from "./managejobs";

function AdminDashboard({ accessToken, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/jobs/"),
        fetch("http://127.0.0.1:8000/api/applications/")
      ]);

      if (!jobsResponse.ok || !applicationsResponse.ok) {
        throw new Error("Unable to load dashboard data");
      }

      const jobs = await jobsResponse.json();
      const applications = await applicationsResponse.json();

      setTotalJobs(Array.isArray(jobs) ? jobs.length : 0);
      setTotalApplications(
        Array.isArray(applications) ? applications.length : 0
      );

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <h2>HireSphere</h2>
        <p>Admin Panel</p>

        <button onClick={() => setActivePage("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setActivePage("applications")}>
          Applications
        </button>

        <button onClick={() => setActivePage("jobs")}>
          Manage Jobs
        </button>

        <button onClick={onLogout}>
          Logout
        </button>
       </aside>

      <main className="admin-content">

      {activePage === "dashboard" && (
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome to HireSphere Admin Panel.</p>

    {loading ? (
      <p>Loading statistics...</p>
    ) : (
      <div className="stats-container">

        <div className="stat-card">
          <h3>Total Jobs</h3>
          <h1>{totalJobs}</h1>
        </div>

        <div className="stat-card">
          <h3>Total Applications</h3>
          <h1>{totalApplications}</h1>
        </div>

        <div className="stat-card">
          <h3>Total Applicants</h3>
          <h1>{totalApplications}</h1>
        </div>

      </div>
    )}
  </div>
)}

        {activePage === "applications" && (
          <Applications />
        )}

        {activePage === "jobs" && <ManageJobs />}


      </main>
    </div>
  );
}

export default AdminDashboard;
