import './Navbar.css'

import polishFlag from './img/poland.svg'
import englishFlag from './img/english.svg'

function Navbar({
    theme,
    setTheme,
    language,
    setLanguage
}) {

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    function toggleLanguage() {
        setLanguage(
            language === "polish"
                ? "english"
                : "polish"
        )
    }

    return (
        <nav className="navbar">

            <div className="navbar-right">

                <img
                    src={
                        language === "polish"
                            ? englishFlag
                            : polishFlag
                    }
                    alt="language"
                    className="flag"
                    onClick={toggleLanguage}
                />

                <label className="switch">

                    <input
                        type="checkbox"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                    />

                    <span className="slider"></span>

                </label>

            </div>

        </nav>
    )
}

export default Navbar