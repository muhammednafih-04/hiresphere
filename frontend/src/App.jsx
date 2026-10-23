
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/jobs/';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationJob, setApplicationJob] = useState(null);

  const [applicationData, setApplicationData] = useState({
  applicant_name: "",
  applicant_email: "",
  resume_link: "",
  cover_letter: "",
  });
  const handleApply = (job) => {
    setApplicationJob(job);
    setShowApplicationForm(true);
  };

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
  
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.required_skills.toLowerCase().includes(search.toLowerCase());
  
    const matchesLocation =
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
  
    const matchesType =
      typeFilter === '' || job.job_type === typeFilter;
  
    return matchesSearch && matchesLocation && matchesType;
  });

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

      {selectedJob && (
          <section className="job-details-page">
          <button
          className="back-btn"
          onClick={() => handleApply(selectedJob)}
          >
          ← Back to Jobs
        </button>

      <div className="job-details-card">
      <p className="eyebrow">JOB DETAILS</p>

      <h1>{selectedJob.title}</h1>
      <h3>{selectedJob.company}</h3>

      <p>Location: {selectedJob.location}</p>
      <p>Job Type: {selectedJob.job_type}</p>
      <p>Salary: {selectedJob.salary}</p>

      <h3>Description</h3>
      <p>{selectedJob.description}</p>

      <h3>Required Skills</h3>
      <p>{selectedJob.required_skills}</p>

      <button
        className="apply-btn"
        onClick={() =>
          alert("Job applications will be implemented in the next module.")
        }
          >
           Apply Now →
          </button>
        </div>
      </section>
    )}

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
            
<div className="job-search">
  <input
    type="text"
    placeholder="Search job title, company or skills..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <input
    type="text"
    placeholder="Filter by location..."
    value={locationFilter}
    onChange={(e) => setLocationFilter(e.target.value)}
  />

  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
  >
    <option value="">All Job Types</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Internship">Internship</option>
    <option value="Remote">Remote</option>
    <option value="Contract">Contract</option>
  </select>
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
          {filteredJobs.map((job) => ( (
              <article className="job-card" key={job.id}>
                <div className="company-icon">
                  {(job.company || '?').charAt(0).toUpperCase()}
                </div>

                <span className="job-type">{job.job_type}</span>

                <span className="job-count">
                {filteredJobs.length} jobs found
                </span>

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
              onClick={() => {
              setSelectedJob(job);
              window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                >
              View Opportunity →
              </button>
              </article>
            )))}
            {showApplicationForm && applicationJob && (
  <div className="application-overlay">
    <div className="application-modal">
      <button
        type="button"
        className="close-application"
        onClick={() => setShowApplicationForm(false)}
      >
        ×
      </button>

      <h2>Apply for {applicationJob.title}</h2>
      <p>{applicationJob.company}</p>

      <form onSubmit={submitApplication}>
        <input
          type="text"
          placeholder="Full Name"
          value={applicationData.applicant_name}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              applicant_name: e.target.value,
            })
          }
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={applicationData.applicant_email}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              applicant_email: e.target.value,
            })
          }
          required/>

        <input
          type="url"
          placeholder="Resume link (Google Drive, etc.)"
          value={applicationData.resume_link}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              resume_link: e.target.value,
            })
          }
          required
        />

        <textarea
          placeholder="Cover Letter (optional)"
          value={applicationData.cover_letter}
          onChange={(e) =>
            setApplicationData({
              ...applicationData,
              cover_letter: e.target.value,
            })
          }
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  </div>
)}
   
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
