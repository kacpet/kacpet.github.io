import l_bg from './img/light-bg.png'
import d_bg from './img/dark-bg.png'
import './Home.css'

function Home({ theme, language, setView }) {
    return (
        <div className="home">

            {/* BAZOWE TŁO (natychmiastowe) */}
            <div className={`home-bg-base ${theme}`} />

            {/* OBRAZ TŁA (animowany) */}
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
                        onClick={() => setView("about")}
                    >
                        {language === "polish"
                            ? "O mnie"
                            : "About me"}
                    </button>

                    <button
                        className={`nav-btn right ${theme}`}
                        onClick={() => setView("skills")}
                    >
                        {language === "polish"
                            ? "Umiejętności / CV"
                            : "Skills / CV"}
                    </button>

                    <button
                        className={`nav-btn bottom ${theme}`}
                        onClick={() => setView("projects")}
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