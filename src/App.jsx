import { useState } from 'react'
import './App.css'

import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

import { renderView } from './router/renderView'

function App() {

  const [theme, setTheme] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  const [language, setLanguage] = useState(() => {
    const systemLang = navigator.language || navigator.userLanguage
    return systemLang.startsWith("pl") ? "polish" : "english"
  })

  const [currentView, setCurrentView] = useState("home")

  return (
    <div className={`App ${theme}`}>

      <Navbar
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        setView={setCurrentView}
      />

      {renderView({
        currentView,
        theme,
        language,
        setCurrentView
      })}

      <Footer
        theme={theme}
        language={language}
      />

    </div>
  )
}

export default App