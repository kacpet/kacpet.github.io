import "./CV.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Icon from "../icons/Icons"

function Cv({ theme, language }) {

    const navigate = useNavigate()

    const [enter, setEnter] = useState(false)

    useEffect(() => {

        const t = setTimeout(() => {
            setEnter(true)
        }, 30)

        return () => clearTimeout(t)

    }, [])

    const t = {

        polish: {
            title: "CV / Kwalifikacje",
            education: "Edukacja",
            certs: "Certyfikaty",
            languages: "Umiejętności techniczne",

            frontend: "Frontend",
            backend: "Backend",
            tools: "Narzędzia",

            school: "TME (Szczecin) – Technik programista",
            schoolDesc: "Ukończone w 2026.",

            more: "Więcej informacji",

            mottoTitle: "Motto",
            motto: "Zamieniam pomysły w czysty i funkcjonalny kod.",

            focusTitle: "Specjalizacja",
            focusDesc:
                "Tworzenie nowoczesnych aplikacji webowych z naciskiem na UI, UX oraz wydajność.",
        },

        english: {
            title: "CV / Qualifications",
            education: "Education",
            certs: "Certificates",
            languages: "Technical Skills",

            frontend: "Frontend",
            backend: "Backend",
            tools: "Tools",

            school: "Technical school – IT Specialist",
            schoolDesc: "Graduated in 2026. Programming profile.",

            more: "More information",

            mottoTitle: "Motto",
            motto: "Turning ideas into clean and functional code.",

            focusTitle: "Specialization",
            focusDesc:
                "Creating modern web applications focused on UI, UX and performance.",
        },
    }

    const text = t[language] || t.polish

    const skills = {

        frontend: [
            {
                name: "JavaScript",
                icon: <Icon name="javascript" />,
                path: "/javascript"
            },

            {
                name: "React",
                icon: <Icon name="react" />,
                path: "/react"
            },

            {
                name: "Angular",
                icon: <Icon name="angular" />,
                path: "/angular"
            },

            {
                name: "Vue.js",
                icon: <Icon name="vue" />,
                path: "/vue"
            },
        ],

        backend: [
            {
                name: "C++",
                icon: <Icon name="cpp" />,
                path: "/cpp"
            },

            {
                name: "Python",
                icon: <Icon name="python" />,
                path: "/python"
            },

            {
                name: "SQL",
                icon: <Icon name="sql" />,
                path: "/sql"
            },

            {
                name: "Java",
                icon: <Icon name="java" />,
                path: "/java"
            },
        ],

        tools: [
            {
                name: "GitHub",
                icon: <Icon name={`github ${theme}`} />,
                path: "/github"
            },

            {
                name: "GitLab",
                icon: <Icon name="gitlab" />,
                path: "/gitlab"
            },

            {
                name: "Figma",
                icon: <Icon name="figma" />,
                path: "/figma"
            },

            {
                name: "VS Code",
                icon: <Icon name="vscode" />,
                path: "/vscode"
            },
        ],
    }

    function renderSkill(skill, index) {

        return (
            <div
                key={index}
                className="skill-item"
            >

                <div className="skill-left">

                    {skill.icon}

                    <span>
                        {skill.name}
                    </span>

                </div>

                <span
                    className="skill-more"
                    onClick={() => navigate(skill.path)}
                >
                    {text.more} →
                </span>

            </div>
        )
    }

    return (
        <section className={`cv ${theme} ${enter ? "cv-enter" : ""}`}>

            <div className="cv-container">

                <div className="cv-header">
                    <h1>{text.title}</h1>
                </div>

                <div className="cv-grid">

                    <div className="cv-left">

                        <div
                            className="cv-card motto-card"
                            style={{ "--d": "0.08s" }}
                        >
                            <span className="motto-label">
                                {text.mottoTitle}
                            </span>

                            <h2 className="motto-text">
                                {text.motto}
                            </h2>
                        </div>

                        <div
                            className="cv-card"
                            style={{ "--d": "0.14s" }}
                        >
                            <h2>{text.education}</h2>

                            <h3>{text.school}</h3>

                            <p>{text.schoolDesc}</p>
                        </div>

                        <div
                            className="cv-card"
                            style={{ "--d": "0.22s" }}
                        >
                            <h2>{text.focusTitle}</h2>

                            <p>{text.focusDesc}</p>
                        </div>

                        <div
                            className="cv-card"
                            style={{ "--d": "0.34s" }}
                        >
                            <h2>{text.certs}</h2>

                            <p>• INF 03</p>
                            <p>• INF 04</p>
                        </div>

                    </div>

                    <div className="cv-right">

                        <div
                            className="cv-card"
                            style={{ "--d": "0.18s" }}
                        >

                            <h2>{text.languages}</h2>

                            <h3>{text.frontend}</h3>

                            <div className="skill-grid">
                                {skills.frontend.map(renderSkill)}
                            </div>

                            <h3>{text.backend}</h3>

                            <div className="skill-grid">
                                {skills.backend.map(renderSkill)}
                            </div>

                            <h3>{text.tools}</h3>

                            <div className="skill-grid">
                                {skills.tools.map(renderSkill)}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default Cv