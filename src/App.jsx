import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar/Navbar'

function App() {

  const [theme, setTheme] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  const [language, setLanguage] = useState("polish")

  return (
    <div className={`App ${theme}`}>

      <Navbar
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />

      <h1>
        {language === "polish"
          ? "Kacper Makulus (kacpet)//polski"
          : "Kacper Makulus (kacpet)//english"}
      </h1>

    </div>
  )
}

export default App