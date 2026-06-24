import "./Projects.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../icons/Icons";

function Projects({ theme, language }) {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setEnter(true);
    }, 30);

    return () => clearTimeout(t);
  }, []);

  const text = {
    english: {
      label: "PORTFOLIO",
      title: "Projects",
      description: "Explore projects grouped by technology.",
      view: "View Projects →",
    },
    polish: {
      label: "PORTFOLIO",
      title: "Projekty",
      description: "Przegląd projektów pogrupowanych według technologii.",
      view: "Zobacz projekty →",
    },
  };

  const t = text[language] || text.en;

  const technologies = [
    { name: "JavaScript", logo: <Icons name="javascript" />, path: "/projects/javascript", projects: 6 },
    { name: "React", logo: <Icons name="react" />, path: "/projects/react", projects: 4 },
    { name: "Angular", logo: <Icons name="angular" />, path: "/projects/angular", projects: 2 },
    { name: "Vue", logo: <Icons name="vue" />, path: "/projects/vue", projects: 2 },
    { name: "C++", logo: <Icons name="cpp" />, path: "/projects/cpp", projects: 10 },
    { name: "Python", logo: <Icons name="python" />, path: "/projects/python", projects: 2 },
    { name: "SQL", logo: <Icons name="sql" />, path: "/projects/sql", projects: 2 },
    { name: "Java", logo: <Icons name="java" />, path: "/projects/java", projects: 5 },
  ];

  return (
    <section className={`projects ${theme} ${enter ? "projects-enter" : ""}`}>
      <div className="projects-container">
        <div className="projects-header">
          <span className="projects-label">{t.label}</span>

          <h1>{t.title}</h1>

          <p>{t.description}</p>
        </div>

        <div className="projects-grid">
          {technologies.map((tech, index) => (
            <Link
              key={tech.name}
              to={tech.path}
              className="project-card"
              style={{ "--d": `${index * 120}ms` }}
            >
              <div className="project-glow" />

              <div className="project-logo">
                {tech.logo}
              </div>

              <h2 className={theme === "light" ? "text-dark" : ""}>
                {tech.name}
              </h2>

              <div className="project-divider" />

              <span className="project-count">
                {tech.projects} Projects
              </span>

              <span className="project-more">
                {t.view}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;