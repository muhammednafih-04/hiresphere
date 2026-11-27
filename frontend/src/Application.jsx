
import { useState, useEffect } from "react";

function Applications({ accessToken }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/api/applications/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load applications"
          );
        }

        return data;
      })
      .then((data) => {
        setApplications(
          Array.isArray(data) ? data : data.results || []
        );
      })
      .catch((err) => {
        console.error("Applications error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
  
      const data = await response.json();
  
      console.log("Status code:", response.status);
      console.log("Server response:", data);
  
      if (!response.ok) {
        throw new Error(
          JSON.stringify(data)
        );
      }
  
      setApplications((previous) =>
        previous.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
  
      alert("Status updated successfully!");
  
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return <h3>Loading applications...</h3>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="applications-page">
      <h2>Job Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Job</th>
              <th>Resume</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.applicant_name}</td>
                <td>{app.applicant_email}</td>
                <td>{app.job_title || app.job}</td>

                <td>
                  {app.resume ? (
                    <a
                      href={
                        app.resume.startsWith("http")
                          ? app.resume
                          : `http://127.0.0.1:8000${app.resume}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No Resume"
                  )}
                </td>

                <td>
                  <select
                    value={app.status || "Pending"}
                    onChange={(e) =>
                      updateApplicationStatus(
                        app.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Applications;
