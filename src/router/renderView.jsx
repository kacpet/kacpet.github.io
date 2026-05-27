import Home from "../components/Home/Home"
import About from "../components/About/About"
import CV from "../components/CV/CV"
import Projects from "../components/Projects/Projects"

import ReactPage from "../components/ProgrammLang/React"
import JavaScriptPage from "../components/ProgrammLang/JavaScript"
import AngularPage from "../components/ProgrammLang/Angular"
import VuePage from "../components/ProgrammLang/Vue"
import CppPage from "../components/ProgrammLang/Cpp"
import PythonPage from "../components/ProgrammLang/Python"
import JavaPage from "../components/ProgrammLang/Java"


export function renderView({
    currentView,
    theme,
    language,
    setCurrentView
}) {
    switch (currentView) {

        case "home":
            return (
                <Home
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )

        case "about":
            return (
                <About
                    theme={theme}
                    language={language}
                />
            )

        case "skills":
            return (
                <CV
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )

        case "react":
            return (
                <ReactPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "javascript":
            return (
                <JavaScriptPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "angular":
            return ( 
                <AngularPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "vue":
            return (
                <VuePage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "cpp":
            return (
                <CppPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "python":
            return (
                <PythonPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
        case "java":
            return (
                <JavaPage
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )



        case "projects":
            return (
                <Projects
                    theme={theme}
                    language={language}
                />
            )

        default:
            return (
                <Home
                    theme={theme}
                    language={language}
                    setView={setCurrentView}
                />
            )
    }
}