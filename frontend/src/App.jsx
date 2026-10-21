
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/jobs/';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    salary: '',
    description: '',
    required_skills: '',
  });

  async function loadJobs() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Could not load jobs');
      }

      const data = await response.json();
      setJobs(data);
      setError('');
    } catch {
      setError('Unable to load jobs. Check your Django server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setNewJob((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      const responseText = await response.text();

      console.log("POST status:", response.status);
      console.log("POST response:", responseText);
      
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned HTML or invalid JSON. Status: ${response.status}. Check the console.`
        );
      }
      setMessage('Job posted successfully!');
      setNewJob({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        salary: '',
        description: '',
        required_skills: '',
      });

      await loadJobs();
    } catch (err) {
      setError(err.message || 'Unable to post the job.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="/">HireSphere<span>.</span></a>

        <div className="nav-links">
          <a href="#jobs">Find Jobs</a>
          <a href="#post-job">Post a Job</a>
          <a href="#about">About</a>
          <button
            className="login-btn"
            onClick={() => alert('Login module coming soon!')}
          >
            Login
          </button>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">YOUR NEXT OPPORTUNITY STARTS HERE</p>

        <h1>
          Find a job that
          <br />
          <span>moves you forward.</span>
        </h1>

        <p className="hero-text">
          Discover opportunities, connect with employers,
          and take the next step in your career.
        </p>

        <a href="#jobs" className="hero-btn">
          Explore Jobs →
        </a>

        <div className="hero-stats">
          <div>
            <strong>Career</strong>
            <span>Opportunities</span>
          </div>
          <div>
            <strong>Smart</strong>
            <span>Job Discovery</span>
          </div>
          <div>
            <strong>Your</strong>
            <span>Next Chapter</span>
          </div>
        </div>
      </header>

      <main>
        <section id="post-job" className="post-job-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EMPLOYER CENTRE</p>
              <h2>Post a Job</h2>
            </div>
          </div>

          <p className="form-intro">
            Enter the job details below to publish a new opportunity.
          </p>

          <form className="job-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Job Title
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleChange}
                  placeholder="e.g. Python Developer"
                  required
                />
              </label>

              <label>
                Company Name
                <input
                  type="text"
                  name="company"
                  value={newJob.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Solutions"
                  required
                />
              </label>

              <label>
                Location
                <input
                  type="text"
                  name="location"
                  value={newJob.location}
                  onChange={handleChange}
                  placeholder="e.g. Kozhikode / Remote"
                  required
                />
              </label>

              <label>
                Job Type
                <select
                  name="job_type"
                  value={newJob.job_type}
                  onChange={handleChange}
                  required
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </label>

              <label>
                Salary
                <input
                  type="text"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹3–5 LPA"
                  required
                />
              </label>

              <label>
                Required Skills
                <input
                  type="text"
                  name="required_skills"
                  value={newJob.required_skills}
                  onChange={handleChange}
                  placeholder="Python, Django, SQL"
                  required
                />
              </label>
            </div>

            <label>
              Job Description
              <textarea
                name="description"
                value={newJob.description}
                onChange={handleChange}
                placeholder="Describe the role and responsibilities..."
                rows="5"
                required
              />
            </label>

            <button
              className="submit-job-btn"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : 'Publish Job'}
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error">{error}</p>}
          </form>
        </section>

        <section id="jobs" className="jobs-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPPORTUNITIES FOR YOU</p>
              <h2>Latest Jobs</h2>
            </div>

            <span className="job-count">
              {jobs.length} jobs
            </span>
          </div>

          {loading && <p className="message">Loading jobs...</p>}

          {!loading && error && !message && (
            <p className="error">{error}</p>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p className="message">No jobs available yet. Post the first job!</p>
          )}

          <div className="job-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="company-icon">
                  {(job.company || '?').charAt(0).toUpperCase()}
                </div>

                <span className="job-type">{job.job_type}</span>

                <h3>{job.title}</h3>
                <p className="company-name">{job.company}</p>

                <div className="job-details">
                  <span>📍 {job.location}</span>
                  <span>{job.salary}</span>
                </div>

                <p className="job-description">
                  {job.description}
                </p>

                <p className="skills">
                  <strong>Skills:</strong> {job.required_skills}
                </p>

                <button
                  className="apply-btn"
                  onClick={() =>
                    alert('Job applications will be added in a later step.')
                  }
                >
                  View Opportunity →
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="about">
        <a className="logo" href="/">HireSphere<span>.</span></a>
        <p>Connecting talent with opportunity.</p>
        <p>© 2026 HireSphere</p>
      </footer>
    </div>
  );
}

export default App;
