import "./MiniGames.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function MiniGames({ theme, language }) {

    const navigate = useNavigate()
    const [enter, setEnter] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => {
            setEnter(true)
        }, 30)

        return () => clearTimeout(t)
    }, [])

    const text = {
        polish: {
            title: "Mini gry",
            button: "Zagraj teraz",

            gameTitle: "Papier – Kamień – Nożyce",
            gameDesc:
                "Klasyczna gra logiczna, w której wybierasz jedną z trzech opcji i walczysz z komputerem lub innym graczem."
        },

        english: {
            title: "Mini Games",
            button: "Play now",

            gameTitle: "Rock – Paper – Scissors",
            gameDesc:
                "A classic logic game where you choose one of three options and compete against the computer or another player."
        }
    }

    const t = text[language] || text.polish

    return (
        <section className={`minigames ${theme} ${enter ? "enter" : ""}`}>

            <div className="minigames-container">

                <div className="minigames-header">
                    <h1>{t.title}</h1>
                </div>

                <div className="minigames-card">

                    <h2>✊ 📄 ✂️ {t.gameTitle}</h2>

                    <p>
                        {t.gameDesc}
                    </p>

                    <button
                        className="minigames-button"
                        onClick={() => navigate("/game")}
                    >
                        {t.button} →
                    </button>

                </div>

            </div>

        </section>
    )
}

export default MiniGames