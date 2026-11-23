import { useState, useEffect } from "react";

function Applications({ accessToken}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  
      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
  
      setApplications((previousApplications) =>
        previousApplications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

    
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/applications/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load applications");
        }
        return response.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  if (loading) return <h3>Loading applications...</h3>;

  if (error) return <p>{error}</p>;

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
              <th>status</th>
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
  <select
    value={app.status || "Pending"}
    onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
  >
    <option value="Pending">Pending</option>
    <option value="Reviewed">Reviewed</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Rejected">Rejected</option>
  </select>
</td>
                <td>
                  {app.resume && (
                    <a
                      href={`http://127.0.0.1:8000${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                    View Resume
                    </a>
                    
                    
                )}
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