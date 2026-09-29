import React from "react";
import "../style/home.scss";

const Home = () => {
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
            <button className="generate-btn" type="button">
              <span aria-hidden="true">★</span> Generate My Interview Strategy
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default Home;
