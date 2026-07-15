import "./MiniGames.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MiniGames({ theme, language }) {
    const navigate = useNavigate();
    const [enter, setEnter] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const t = setTimeout(() => {
            setEnter(true);
        }, 30);

        return () => clearTimeout(t);
    }, []);

    const text = {
        polish: {
            title: "Mini gry",
            button: "Zagraj teraz",

            rpsTitle: "📄 ✊ ✂️ Papier – Kamień – Nożyce",
            rpsDesc: "Klasyczna gra logiczna, w której wybierasz jedną z trzech opcji i walczysz z innym graczem.",

            connect4Title: "🔴 🟡 4 w Rzędzie",
            connect4Desc: "Połącz cztery pionki w jednej linii szybciej niż przeciwnik i wygraj pojedynek.",

            quixoTitle: "❌ ⭕ Quixo",
            quixoDesc: "Taktyczna gra planszowa, w której przesuwasz kostki i próbujesz ułożyć linię swojego znaku.",
        },

        english: {
            title: "Mini Games",
            button: "Play now",

            rpsTitle: "✊ 📄 ✂️ Rock – Paper – Scissors",
            rpsDesc: "A classic logic game where you choose one of three options and compete against another player.",

            connect4Title: "🔴 🟡 Connect Four",
            connect4Desc: "Connect four pieces in a row before your opponent and claim victory.",

            quixoTitle: "❌ ⭕ Quixo",
            quixoDesc: "A tactical board game where you push cubes and try to form a line of your symbol.",
        },
    };

    const t = text[language] || text.polish;

    return (
        <section className={`minigames ${theme} ${enter ? "enter" : ""}`}>
            <div className="minigames-container">
                <div className="minigames-header">
                    <h1>{t.title}</h1>
                </div>

                {/* RPS */}
                <div className="minigames-card">
                    <h2>{t.rpsTitle}</h2>
                    <p>{t.rpsDesc}</p>
                    <button className="minigames-button" onClick={() => navigate("/rock-paper-scizzors")}>
                        {t.button} →
                    </button>
                </div>

                {/* CONNECT 4 */}
                <div className="minigames-card">
                    <h2>{t.connect4Title}</h2>
                    <p>{t.connect4Desc}</p>
                    <button className="minigames-button" onClick={() => navigate("/connect-four")}>
                        {t.button} →
                    </button>
                </div>

                {/* QUIXO */}
                <div className="minigames-card">
                    <h2>{t.quixoTitle}</h2>
                    <p>{t.quixoDesc}</p>
                    <button className="minigames-button" onClick={() => navigate("/quixo")}>
                        {t.button} →
                    </button>
                </div>
            </div>
        </section>
    );
}

export default MiniGames;
