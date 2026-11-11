
import { useState, useEffect } from "react";

function ManageJobs() {
  const API_URL = "http://127.0.0.1:8000/api/jobs/";

  const emptyForm = {
    title: "",
    company: "",
    location: "",
    job_type: "",
    salary: "",
    description: "",
    required_skills: "",
  };

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load all jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = editingId
      ? `${API_URL}${editingId}/`
      : API_URL;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(JSON.stringify(data));
        return;
      }

      setMessage(
        editingId
          ? "Job updated successfully!"
          : "Job added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      fetchJobs();
    } catch (error) {
      setMessage("Something went wrong. Check your Django server.");
    }
  };

  // Load job details into form
  const handleEdit = (job) => {
    setEditingId(job.id);

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      job_type: job.job_type || "",
      salary: job.salary || "",
      description: job.description || "",
      required_skills: job.required_skills || "",
    });

    setMessage("");
  };

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete job");
      }

      setMessage("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  return (
    <div className="manage-jobs">
      <h1>Manage Jobs</h1>
      <p>Add, edit and manage job postings.</p>

      {message && <p className="job-message">{message}</p>}

      <div className="job-form-container">
        <h2>{editingId ? "Edit Job" : "Add New Job"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            name="job_type"
            placeholder="Job Type (Full-time, Part-time...)"
            value={form.job_type}
            onChange={handleChange}
            required
          />

          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <textarea
            name="required_skills"
            placeholder="Required Skills"
            value={form.required_skills}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Job" : "Add Job"}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="jobs-list">
        <h2>All Jobs</h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>
                    <button onClick={() => handleEdit(job)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(job.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageJobs;
