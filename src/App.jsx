import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Footer from './components/Footer/Footer'

function App() {

  const [theme, setTheme] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  const [language, setLanguage] = useState("polish")
  const [currentView, setCurrentView] = useState("home")

  const renderView = () => {
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
          <div style={{ padding: "100px" }}>
            Sekcja: O mnie / About me
          </div>
        )

      case "projects":
        return (
          <div style={{ padding: "100px" }}>
            Sekcja: Projekty / Projects
          </div>
        )

      case "skills":
        return (
          <div style={{ padding: "100px" }}>
            Sekcja: Umiejętności / Skills
          </div>
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

  return (
    <div className={`App ${theme}`}>

      <Navbar
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        setView={setCurrentView}
      />

      {renderView()}

      <Footer
        theme={theme}
        language={language}
      />

    </div>
  )
}

export default App