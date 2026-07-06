import "./LangPage.css"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function LangPage({
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
    <section className={`lang-page ${theme} ${enter ? "lang-enter" : ""}`}>
      
      <div className="lang-background">
        <div className="lang-bg-blur lang-blur-1"></div>
        <div className="lang-bg-blur lang-blur-2"></div>
      </div>

      <div className="lang-container">

        {/* HERO */}
        <header className="lang-hero">

          <div className="lang-logo-wrapper" style={{ "--d": "0.05s" }}>
            <div className="lang-logo">
              {data.logo}
            </div>
          </div>

          <div className="lang-heading" style={{ "--d": "0.15s" }}>

            <span className="lang-subtitle">
              {data.category}
            </span>

            <h1 className="lang-title">
              {data.title}
            </h1>

            <p className="lang-description">
              {data.description[language]}
            </p>

            {/* 🔥 WYEKSPONOWANY CTA */}
            <button
              className="lang-projects-cta"
              onClick={() => navigate(data.projectsPath || "/")}
              style={{ "--d": "0.25s" }}
            >
              {language === "polish"
                ? "Zobacz projekty"
                : "View projects"}
            </button>

          </div>

        </header>

        {/* GRID */}
        <div className="lang-grid">

          {/* SKILLS */}
          <section className="lang-card" style={{ "--d": "0.25s" }}>
            
            <div className="section-top">
              <span className="section-dot"></span>
              <h2>
                {language === "polish" ? "Umiejętności" : "Skills"}
              </h2>
            </div>

            <div className="skills-list">
              {data.skills.map((skill, index) => (
                <div className="skill-item" key={index}>
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>

          </section>

        </div>

      </div>

    </section>
  )
}

export default LangPage