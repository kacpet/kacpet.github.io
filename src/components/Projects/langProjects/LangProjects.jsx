import "./LangProjects.css";
import ImageSlider from "../ImageSlider/ImageSlider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LangProjects({ theme, language, data }) {
    const [enter, setEnter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const t = setTimeout(() => {
            setEnter(true);
        }, 40);

        return () => clearTimeout(t);
    }, []);

    return (
        <section className={`lang-projects ${theme} ${enter ? "lang-enter" : ""}`}>
            <div className="lang-projects-container">
                <header className="lang-projects-header">
                    <h1>{language === "polish" ? `Projekty - ${data.title}` : `${data.title} Projects`}</h1>

                    <p className="lang-projects-subtitle">
                        {language === "polish"
                            ? "Wybrane projekty oparte na tej technologii"
                            : "Selected projects built with this technology"}
                    </p>
                </header>

                <div className="lang-projects-grid">
                    {data.projects.length > 0 ? (
                        data.projects.map((project, index) => (
                            <article key={index} className="project-card" style={{ "--d": `${0.15 + index * 0.08}s` }}>
                                <div className="project-image">
                                    <ImageSlider project={project} theme={theme} language={language} />
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
                                        {project.pageLink && (
                                            <a
                                                href={project.pageLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-page"
                                            >
                                                {language === "polish" ? "Strona" : "Live Demo"}
                                            </a>
                                        )}

                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-github"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="empty-state">
                            {language === "polish" ? "Brak projektów" : "No projects available"}
                        </div>
                    )}
                </div>

                <div className="back-wrapper">
                    <button onClick={() => navigate(-1)}>{language === "polish" ? "Powrót" : "Back"}</button>
                </div>
            </div>
        </section>
    );
}

export default LangProjects;
