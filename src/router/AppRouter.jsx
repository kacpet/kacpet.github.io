import { Routes, Route } from "react-router-dom"

import Home from "../components/Home/Home"
import About from "../components/About/About"
import CV from "../components/CV/CV"
import Projects from "../components/Projects/Projects"

import LangPage from "../components/ProgrammLang/LangPage/LangPage"
import ToolsPage from "../components/Tools/ToolsPage/ToolsPage"

import ReactData from "../components/ProgrammLang/React"
import JavaScriptData from "../components/ProgrammLang/JavaScript"
import AngularData from "../components/ProgrammLang/Angular"
import VueData from "../components/ProgrammLang/Vue"
import CppData from "../components/ProgrammLang/Cpp"
import PythonData from "../components/ProgrammLang/Python"
import JavaData from "../components/ProgrammLang/Java"
import SQLData from "../components/ProgrammLang/SQL"

import GithubData from "../components/tools/GitHub"
import GitLabData from "../components/Tools/GitLab"
import FigmaData from "../components/tools/Figma"
import VSCodeData from "../components/tools/VSCode"

import LangProjects from "../components/Projects/langProjects/LangProjects"

import ReactProjectsData from "../components/Projects/langProjects/langs/ReactProjectsData"
import JavaScriptProjectsData from "../components/Projects/langProjects/langs/JavaScriptProjectsData"
import AngularProjectsData from "../components/Projects/langProjects/langs/AngularProjectsData"
import VueProjectsData from "../components/Projects/langProjects/langs/VueProjectsData"
import CppProjectsData from "../components/Projects/langProjects/langs/CppProjectsData"
import PythonProjectsData from "../components/Projects/langProjects/langs/PythonProjectsData"
import JavaProjectsData from "../components/Projects/langProjects/langs/JavaProjectsData"
import SQLProjectsData from "../components/Projects/langProjects/langs/SqlProjectsData"
import MiniGames from "../components/MiniGames/MiniGames"

function AppRouter({ theme, language }) {

  const langPages = [
    { path: "/react", data: ReactData },
    { path: "/javascript", data: JavaScriptData },
    { path: "/angular", data: AngularData },
    { path: "/vue", data: VueData },
    { path: "/cpp", data: CppData },
    { path: "/python", data: PythonData },
    { path: "/java", data: JavaData },
    { path: "/sql", data: SQLData }
  ]

  const toolsPages = [
    { path: "/github", data: GithubData(theme) },
    { path: "/gitlab", data: GitLabData(theme) },
    { path: "/figma", data: FigmaData(theme) },
    { path: "/vscode", data: VSCodeData(theme) }
  ]

const langProjects = [
  { path: "/projects/react", data: ReactProjectsData },
  { path: "/projects/javascript", data: JavaScriptProjectsData },
  { path: "/projects/angular", data: AngularProjectsData },
  { path: "/projects/vue", data: VueProjectsData },
  { path: "/projects/cpp", data: CppProjectsData },
  { path: "/projects/python", data: PythonProjectsData },
  { path: "/projects/java", data: JavaProjectsData },
  { path: "/projects/sql", data: SQLProjectsData }
];

  return (
    <Routes>

      <Route path="/" element={<Home theme={theme} language={language} />} />
      <Route path="/about" element={<About theme={theme} language={language} />} />
      <Route path="/skills" element={<CV theme={theme} language={language} />} />
      <Route path="/projects" element={<Projects theme={theme} language={language} />} />
      <Route path="/mini-games" element={<MiniGames theme={theme} language={language} />} />
      {langPages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <LangPage
              theme={theme}
              language={language}
              data={page.data}
            />
          }
        />
      ))}

      {toolsPages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <ToolsPage
              theme={theme}
              language={language}
              data={page.data}
            />
          }
        />
      ))}

      {langProjects.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={
            <LangProjects
              theme={theme}
              language={language}
              data={page.data}
            />
          }
        />
      ))}

    </Routes>
  )
}

export default AppRouter