import { useNavigate } from "react-router-dom";

import "./Navbar.css";

import polishFlag from "./img/poland.svg";
import englishFlag from "./img/english.svg";
import homeicon from "./img/home.svg";

function Navbar({ theme, setTheme, language, setLanguage }) {
    const navigate = useNavigate();

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    function toggleLanguage() {
        setLanguage(language === "polish" ? "english" : "polish");
    }

    return (
        <nav className="navbar">
            {/* HOME LEFT */}
            <div className="navbar-left">
                <img src={homeicon} className={`home-icon ${theme}`} alt="home" onClick={() => navigate("/")} />
            </div>

            {/* RIGHT SIDE */}
            <div className="navbar-right">
                <img
                    src={language === "polish" ? englishFlag : polishFlag}
                    alt="language"
                    className="flag"
                    onClick={toggleLanguage}
                />

                <label className="switch">
                    <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />

                    <span className="slider"></span>
                </label>
            </div>
        </nav>
    );
}

export default Navbar;
