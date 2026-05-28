import { Routes, Route } from "react-router-dom"

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
import SQLPage from "../components/ProgrammLang/SQL"

function AppRouter({ theme, language }) {

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Home
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/about"
        element={
          <About
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/skills"
        element={
          <CV
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/projects"
        element={
          <Projects
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/react"
        element={
          <ReactPage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/javascript"
        element={
          <JavaScriptPage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/angular"
        element={
          <AngularPage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/vue"
        element={
          <VuePage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/cpp"
        element={
          <CppPage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/python"
        element={
          <PythonPage
            theme={theme}
            language={language}
          />
        }
      />

      <Route
        path="/java"
        element={
          <JavaPage
            theme={theme}
            language={language}
          />
        }
      />
        <Route
        path="/sql"
        element={
          <SQLPage
            theme={theme}
            language={language}
          />
        }
      />
    </Routes>
  )
}

export default AppRouter