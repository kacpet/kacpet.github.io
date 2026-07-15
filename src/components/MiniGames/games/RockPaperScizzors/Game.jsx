import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../base/firebase";
import "./Game.css";

export default function Game({ theme, language }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState(null);
    const [winnerText, setWinnerText] = useState("");
    const [enter, setEnter] = useState(false);

    const getWinner = (p1, p2, name1, name2) => {
        if (p1 === p2) {
            return language === "polish" ? "Remis" : "Draw";
        }

        if (
            (p1 === "rock" && p2 === "scissors") ||
            (p1 === "paper" && p2 === "rock") ||
            (p1 === "scissors" && p2 === "paper")
        ) {
            return language === "polish" ? `Wygrywa ${name1}` : `${name1} wins`;
        }

        return language === "polish" ? `Wygrywa ${name2}` : `${name2} wins`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const animation = setTimeout(() => {
            setEnter(true);
        }, 40);

        let timeoutId;

        const loadGame = async () => {
            const roomRef = doc(db, "rooms", id);

            const snap = await getDoc(roomRef);

            if (!snap.exists()) {
                navigate("/join");
                return;
            }

            const data = snap.data();

            setGameData(data);

            setWinnerText(getWinner(data.choice1, data.choice2, data.player1?.name, data.player2?.name));

            timeoutId = setTimeout(async () => {
                await updateDoc(roomRef, {
                    winnerAt: Date.now(),
                });
            }, 10000);
        };

        loadGame();

        return () => {
            clearTimeout(animation);
            clearTimeout(timeoutId);
        };
    }, [id, navigate, language]);

    const iconMap = {
        rock: "✊",
        paper: "✋",
        scissors: "✌",
    };

    if (!gameData) {
        return (
            <div className={`game-page ${theme}`}>
                <div className="game-container">
                    <div className="game-card">
                        {language === "polish" ? "Ładowanie wyniku..." : "Loading result..."}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className={`game-page ${theme} ${enter ? "game-enter" : ""}`}>
            <div className="game-container">
                <header className="game-header">
                    <h1>{language === "polish" ? "Wynik gry" : "Game result"}</h1>
                </header>

                <div className="game-players">
                    <div className="game-card">
                        <h2>{gameData.player1?.name}</h2>

                        <div className="choice-icon">{iconMap[gameData.choice1]}</div>
                    </div>

                    <div className="winner-box">{winnerText}</div>

                    <div className="game-card">
                        <h2>{gameData.player2?.name}</h2>

                        <div className="choice-icon">{iconMap[gameData.choice2]}</div>
                    </div>
                </div>

                <button className="back-button" onClick={() => navigate("/rock-paper-scizzors")}>
                    {language === "polish" ? "Powrót" : "Back"}
                </button>
            </div>
        </section>
    );
}
