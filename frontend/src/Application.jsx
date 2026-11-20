import { useState, useEffect } from "react";

function Applications({ accessToken}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    
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
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
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