import { useState } from "react";
import "../style/interview.scss";

const report = {
  matchScore: 72,
  technicalQuestions: [
    {
      question:
        "How do you manage asynchronous operations and error handling in Node.js and Express?",
      intention:
        "To assess your core backend proficiency, specifically handling non-blocking I/O and preventing unhandled promise rejections in Express applications.",
      answer:
        "Explain async/await with try-catch blocks, plus Express middleware for centralized error handling and reliable client responses.",
    },
    {
      question:
        "Can you explain how React hooks work, particularly useEffect and useState, and how you prevent unnecessary re-renders?",
      intention:
        "To evaluate your understanding of React's lifecycle and performance optimization techniques.",
      answer:
        "Discuss useState for local state, useEffect for side effects, dependency arrays, and optimization hooks such as useMemo and useCallback.",
    },
    {
      question:
        "How would you design a MongoDB schema for a SaaS application that requires user authentication and data isolation?",
      intention:
        "To check database design skills, NoSQL modeling, relationships, and multi-tenant security.",
      answer:
        "Explain referencing versus embedding, user-owned resources, and indexes on frequently queried fields.",
    },
    {
      question:
        "What is the REST architectural style, and how do you design scalable endpoints using Express.js?",
      intention:
        "To gauge your knowledge of API design principles, HTTP methods, status codes, and resource routing.",
      answer:
        "Cover statelessness, HTTP methods, proper status codes, and modular Express routers and controllers.",
    },
    {
      question:
        "How do you handle state management in large React applications, and when would you choose Context API versus Redux?",
      intention:
        "To understand your architecture decisions around state propagation across component trees.",
      answer:
        "Context is ideal for low-frequency updates such as auth or themes, while an external state library suits complex, high-frequency business state.",
    },
  ],
  behavioralQuestions: [
    {
      question:
        "Tell me about a time you had to learn a completely new technology stack quickly to deliver a project.",
      intention:
        "To evaluate your adaptability, self-learning capability, and execution speed under pressure.",
      answer:
        "Use the STAR method. Explain the resources and study structure you used, then connect them to the successful outcome.",
    },
    {
      question:
        "Describe a situation where you had a disagreement with a team member regarding a technical approach. How did you resolve it?",
      intention:
        "To assess communication skills, conflict resolution, and teamwork in an engineering environment.",
      answer:
        "Focus on listening, data, architectural merits, and finding a compromise or testing both approaches with a quick prototype.",
    },
    {
      question:
        "How do you prioritize your tasks when working on multiple features with tight deadlines?",
      intention:
        "To measure time management, organization, and handling of pressure.",
      answer:
        "Discuss impact versus effort, proactive stakeholder communication, and breaking large features into milestones.",
    },
  ],
  skillGaps: [
    {
      skill: "Professional Years of Experience (1-3 years required)",
      severity: "High",
    },
    {
      skill:
        "Production-grade Node.js architecture and advanced backend patterns",
      severity: "Medium",
    },
    {
      skill:
        "Enterprise-level state management and React performance optimization",
      severity: "Medium",
    },
    { skill: "Third-party AI/LLM API integration experience", severity: "Low" },
    {
      skill: "Advanced authentication systems (JWT, OAuth flows)",
      severity: "Low",
    },
  ],
  preparationPlan: [
    "Core JavaScript proficiency",
    "Backend architecture",
    "Frontend engineering",
    "Database management",
    "Security and nice-to-have requirements",
    "Behavioral readiness and communication",
    "Final review and mock test",
  ],
};

const sections = [
  { id: "technical", label: "Technical Questions", icon: "<>" },
  { id: "behavioral", label: "Behavioral Questions", icon: "□" },
  { id: "roadmap", label: "Road Map", icon: "⌁" },
];

const Interview = () => {
  const [activeSection, setActiveSection] = useState("behavioral");
  const [openQuestion, setOpenQuestion] = useState(0);
  const activeQuestions =
    activeSection === "technical"
      ? report.technicalQuestions
      : report.behavioralQuestions;

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
        </aside>

        <section className="interview-content">
          {activeSection === "roadmap" ? (
            <div className="roadmap-view">
              <header className="content-heading">
                <div>
                  <p className="eyebrow">Your preparation plan</p>
                  <h1>Seven-day road map</h1>
                </div>
                <span className="question-count">
                  {report.preparationPlan.length} days
                </span>
              </header>
              <div className="roadmap-list">
                {report.preparationPlan.map((focus, index) => (
                  <article className="roadmap-item" key={focus}>
                    <span className="roadmap-day">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{focus}</strong>
                      <p>
                        Build confidence through focused practice and review.
                      </p>
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
              <strong>{report.matchScore}</strong>
              <span>%</span>
            </div>
            <p className="score-message">Strong match for this role</p>
          </section>
          <section className="gaps-block">
            <p className="sidebar-label">Skill gaps</p>
            <div className="skill-list">
              {report.skillGaps.map((gap) => (
                <span
                  className={`skill skill--${gap.severity.toLowerCase()}`}
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
