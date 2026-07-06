import "./LangProjects.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


function LangProjects({
  theme,
  language,
  data
}) {
  const [enter, setEnter] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = setTimeout(() => {
      setEnter(true)
    }, 40)

    return () => clearTimeout(t)
  }, [])

  return (
    <section className={`lang-projects ${theme} ${enter ? "lang-enter" : ""}`}>

      <div className="lang-projects-container">

        {/* ================= HEADER ================= */}
        <header className="lang-projects-header">
          <h1>
            {language === "polish"
              ? `Projekty - ${data.title}`
              : `${data.title} Projects`}
          </h1>

          <p className="lang-projects-subtitle">
            {language === "polish"
              ? "Wybrane projekty oparte na tej technologii"
              : "Selected projects built with this technology"}
          </p>
        </header>

        {/* ================= GRID ================= */}
        <div className="lang-projects-grid">

          {data.projects.length > 0 ? (
            data.projects.map((project, index) => (
              <div
                key={index}
                className="project-card"
                style={{ "--d": `${0.15 + index * 0.08}s` }}
              >

                <div className="project-image">
                  <img
                    src={theme === "dark"
                      ? project.imageDark
                      : project.imageLight}
                  
                    alt={project.title}
                  />
                </div>

                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description[language]}</p>

                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i}>{tag}</span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a href={project.github} target="_blank" className="project-github">
                      GitHub
                    </a>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="empty-state">
              {language === "polish"
                ? "Brak projektów"
                : "No projects available"}
            </div>
          )}

        </div>

        {/* ================= BACK BUTTON ================= */}
        <div className="back-wrapper">
          <button onClick={() => navigate(-1)}>
            {language === "polish" ? "Powrót" : "Back"}
          </button>
        </div>

      </div>

    </section>
  )
}

export default LangProjects