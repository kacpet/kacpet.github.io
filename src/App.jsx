import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

import AppRouter from "./router/AppRouter";

function App() {
    const [theme, setTheme] = useState(() => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    const [language, setLanguage] = useState(() => {
        const systemLang = navigator.language || navigator.userLanguage;

        return systemLang.startsWith("pl") ? "polish" : "english";
    });

    return (
        <div className={`App ${theme}`}>
            <ScrollToTop />

            <Navbar theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />

            <AppRouter theme={theme} language={language} />

            <Footer theme={theme} language={language} />
        </div>
    );
}

export default App;
