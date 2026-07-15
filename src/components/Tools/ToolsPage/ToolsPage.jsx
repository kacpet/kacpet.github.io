import "./ToolsPage.css";

import { useEffect, useState } from "react";

function ToolsPage({ theme, language, data }) {
    const [enter, setEnter] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const t = setTimeout(() => {
            setEnter(true);
        }, 40);

        return () => clearTimeout(t);
    }, []);

    return (
        <section className={`tools-page ${theme} ${enter ? "tools-enter" : ""}`}>
            <div className="tools-background">
                <div className="tools-bg-blur tools-blur-1"></div>
                <div className="tools-bg-blur tools-blur-2"></div>
            </div>

            <div className="tools-container">
                {/* HERO */}
                <header className="tools-hero">
                    <div className="tools-logo-wrapper" style={{ "--d": "0.05s" }}>
                        <div className="tools-logo">{data.logo}</div>
                    </div>

                    <div className="tools-heading" style={{ "--d": "0.15s" }}>
                        <span className="tools-subtitle">{data.category}</span>

                        <h1 className="tools-title">{data.title}</h1>

                        <p className="tools-description">{data.description[language]}</p>
                    </div>
                </header>

                {/* GRID */}
                <div className="tools-grid">
                    {/* FEATURES */}
                    <section className="tools-card" style={{ "--d": "0.25s" }}>
                        <div className="section-top">
                            <span className="section-dot"></span>
                            <h2>{language === "polish" ? "Funkcje" : "Features"}</h2>
                        </div>

                        <div className="tools-list">
                            {data.features.map((feature, index) => (
                                <div className="tools-item" key={index}>
                                    <span className="tools-name">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}

export default ToolsPage;
