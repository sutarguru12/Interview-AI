import { React, useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const { generateReport, loading, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (loading) {
    return (
      <main className="home">
        <div className="home__content">
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  const handleGenerateReport = async () => {
    setError("");

    if (!jobDescription.trim()) {
      alert("Please provide a job description.");
      return;
    }

    if (!selfDescription.trim() && !resumeInputRef.current?.files[0]) {
      alert("Please provide either a self-description or upload a resume.");
      return;
    }

    try {
      const resumeFile = resumeInputRef.current?.files[0];
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resume: resumeFile,
      });
      navigate(`/interview/${data._id}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          err.response?.data?.message ||
            "Too many request, Please try again later",
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong, Please Try again later",
        );
      }
    }
  };

  return (
    <main className="home">
      <div className="home__content">
        <header className="home__header">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            <br className="home__desktop-break" /> build a winning strategy.
          </p>
        </header>

        <form className="interview-form">
          <section className="interview-form__job" aria-labelledby="job-title">
            <div className="field-heading">
              <h2 id="job-title">
                <span className="field-icon" aria-hidden="true">
                  J
                </span>
                Target Job Description
              </h2>
              <span className="tag tag--required">Required</span>
            </div>
            <div className="job-description-wrap">
              <textarea
                onChange={(e) => setJobDescription(e.target.value)}
                name="jobDescription"
                id="jobDescription"
                maxLength={5000}
                placeholder={
                  "Paste the full job description here...\ne.g. “Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...”"
                }
              />
              <span className="character-count">0 / 5000 chars</span>
            </div>
          </section>

          <section
            className="interview-form__profile"
            aria-labelledby="profile-title"
          >
            <div className="field-heading">
              <h2 id="profile-title">
                <span
                  className="field-icon field-icon--profile"
                  aria-hidden="true"
                >
                  P
                </span>
                Your Profile
              </h2>
            </div>

            <div className="resume-field">
              <div className="resume-field__heading">
                <label htmlFor="resume">Upload Resume</label>
                <span className="tag">Best results</span>
              </div>
              <label className="upload-box" htmlFor="resume">
                <span className="upload-box__icon" aria-hidden="true">
                  ↑
                </span>
                <strong>Click to upload or drag &amp; drop</strong>
                <span>PDF or DOCX (Max 5MB)</span>
              </label>
              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.docx"
              />
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description-field">
              <label htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <p className="form-notice">
              <span className="form-notice__icon" aria-hidden="true">
                i
              </span>
              <span>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self-Description</strong> is required to generate a
                personalized plan.
              </span>
            </p>
          </section>

          <footer className="interview-form__footer">
            <span className="form-footnote">
              AI-Powered Strategy Generation <span aria-hidden="true">·</span>{" "}
              Approx 30s
            </span>
            <button
              onClick={handleGenerateReport}
              className="generate-btn"
              type="button"
            >
              <span aria-hidden="true">★</span> Generate My Interview Strategy
            </button>
          </footer>
        </form>

        {error && <p className="error-message">{error}</p>}
        <section
          className="recent-reports"
          aria-labelledby="recent-reports-title"
        >
          <div className="recent-reports__header">
            <div>
              <p className="recent-reports__eyebrow">Your workspace</p>
              <h2 id="recent-reports-title">Recent reports</h2>
            </div>
            <span className="recent-reports__count">
              {reports?.length ?? 0}
            </span>
          </div>
          {loading && !reports?.length ? (
            <p className="recent-reports__message" role="status">
              Loading your reports...
            </p>
          ) : reports?.length ? (
            <div className="recent-report-list">
              {reports.map((report) => (
                <button
                  className="recent-report"
                  key={report._id}
                  type="button"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <span className="recent-report__main">
                    <strong>{report.title || "Interview plan"}</strong>
                    <span>
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                  </span>
                  <span className="recent-report__meta">
                    {report.matchScore != null && `${report.matchScore}% match`}
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="recent-reports__message">
              Your generated interview plans will appear here.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
