import { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";

const sections = [
  { id: "technical", label: "Technical Questions", icon: "<>" },
  { id: "behavioral", label: "Behavioral Questions", icon: "□" },
  { id: "roadmap", label: "Road Map", icon: "⌁" },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("behavioral");
  const [openQuestion, setOpenQuestion] = useState(0);
  const { report, loading, generateResumePdfById } = useInterview();
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  if (!report) {
    return (
      <main className="interview-page">
        <div className="interview-shell">
          <p role="status">
            {loading
              ? "Loading interview report..."
              : "Interview report unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const technicalQuestions = report?.technicalQuestions ?? [];
  const behavioralQuestions = report?.behavioralQuestions ?? [];
  const preparationPlan = report?.preparationPlan ?? [];
  const skillGaps = report?.skillGaps ?? [];
  const activeQuestions =
    activeSection === "technical" ? technicalQuestions : behavioralQuestions;

  return (
    <main className="interview-page">
      <div className="interview-shell">
        <aside className="interview-sidebar" aria-label="Interview sections">
          <p className="sidebar-label">Sections</p>
          <nav>
            {sections.map((section) => (
              <button
                className={`section-link ${activeSection === section.id ? "section-link--active" : ""}`}
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id);
                  setOpenQuestion(0);
                }}
              >
                <span aria-hidden="true">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
          <button
            onClick={async () => {
              setIsGeneratingResume(true);
              await generateResumePdfById({ interviewReportId: report._id });
              setIsGeneratingResume(false);
            }}
            className="btn generate-btn"
            disabled={isGeneratingResume}
          >
            Generate Resume
          </button>
        </aside>

        <section className="interview-content">
          {activeSection === "roadmap" ? (
            <div className="roadmap-view">
              <header className="content-heading">
                <div>
                  <p className="eyebrow">Your preparation plan</p>
                  <h1>Road map</h1>
                </div>
                <span className="question-count">
                  {preparationPlan.length} days
                </span>
              </header>
              <div className="roadmap-list">
                {preparationPlan.map((day, index) => (
                  <article className="roadmap-item" key={day.day ?? index}>
                    <span className="roadmap-day">
                      {String(day.day ?? index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{day.focus}</strong>
                      {day.tasks && <p>{day.tasks}</p>}{" "}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <>
              <header className="content-heading">
                <div>
                  <h1>
                    {activeSection === "technical"
                      ? "Technical Questions"
                      : "Behavioral Questions"}
                  </h1>
                  <span className="question-count">
                    {activeQuestions.length} questions
                  </span>
                </div>
              </header>
              <div className="question-list">
                {activeQuestions.map((item, index) => (
                  <article
                    className={`question-card ${openQuestion === index ? "question-card--open" : ""}`}
                    key={item.question}
                  >
                    <button
                      className="question-toggle"
                      type="button"
                      onClick={() =>
                        setOpenQuestion(openQuestion === index ? -1 : index)
                      }
                      aria-expanded={openQuestion === index}
                    >
                      <span className="question-number">Q{index + 1}</span>
                      <span className="question-title">{item.question}</span>
                      <span className="chevron" aria-hidden="true">
                        ⌄
                      </span>
                    </button>
                    {openQuestion === index && (
                      <div className="question-details">
                        <div>
                          <span className="detail-label detail-label--intention">
                            Intention
                          </span>
                          <p>{item.intention}</p>
                        </div>
                        <div>
                          <span className="detail-label detail-label--answer">
                            Model answer
                          </span>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="interview-summary">
          <section className="score-block">
            <p className="sidebar-label">Match score</p>
            <div className="score-ring">
              <strong>{report.matchScore ?? 0}</strong>
              <span>%</span>
            </div>
            <p className="score-message">Strong match for this role</p>
          </section>
          <section className="gaps-block">
            <p className="sidebar-label">Skill gaps</p>
            <div className="skill-list">
              {skillGaps.map((gap) => (
                <span
                  className={`skill skill--${(gap.severity ?? "low").toLowerCase()}`}
                  key={gap.skill}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default Interview;
