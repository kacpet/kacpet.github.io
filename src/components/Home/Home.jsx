import { useNavigate } from "react-router-dom"

import l_bg from "./img/light-bg.png"
import d_bg from "./img/dark-bg.png"

import "./Home.css"

function Home({ theme, language }) {

    const navigate = useNavigate()

    return (
        <div className="home">

            {/* BAZOWE TŁO */}
            <div className={`home-bg-base ${theme}`} />

            {/* OBRAZ TŁA */}
            <div
                className={`home-bg ${theme}`}
                style={{
                    backgroundImage: `url(${theme === "dark" ? d_bg : l_bg})`
                }}
            />

            <div className="hero">

                <div className={`header-home-page ${theme}`}>
                    <h1>
                        {language === "polish"
                            ? "Witaj na stronie"
                            : "Welcome to the page"}
                    </h1>
                </div>

                <div className="buttons-container">

                    <button
                        className={`nav-btn left ${theme}`}
                        onClick={() => navigate("/about")}
                    >
                        {language === "polish"
                            ? "O mnie"
                            : "About me"}
                    </button>

                    <button
                        className={`nav-btn right ${theme}`}
                        onClick={() => navigate("/skills")}
                    >
                        {language === "polish"
                            ? "Umiejętności / CV"
                            : "Skills / CV"}
                    </button>

                    <button
                        className={`nav-btn bottom ${theme}`}
                        onClick={() => navigate("/projects")}
                    >
                        {language === "polish"
                            ? "Projekty"
                            : "Projects"}
                    </button>

                </div>

            </div>
        </div>
    )
}

export default Home