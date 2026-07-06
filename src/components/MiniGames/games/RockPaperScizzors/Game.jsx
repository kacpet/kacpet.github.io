import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../base/firebase";
import "./Game.css";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState(null);
  const [winnerText, setWinnerText] = useState("");

  const getWinner = (p1, p2, name1, name2) => {
    if (p1 === p2) return "Remis";

    if (
      (p1 === "rock" && p2 === "scissors") ||
      (p1 === "paper" && p2 === "rock") ||
      (p1 === "scissors" && p2 === "paper")
    ) {
      return `Wygrywa ${name1}`;
    }

    return `Wygrywa ${name2}`;
  };

  useEffect(() => {
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

      setWinnerText(
        getWinner(
          data.choice1,
          data.choice2,
          data.player1?.name,
          data.player2?.name
        )
      );

      // =========================
      // zamiast usuwać → zapis winnerAt
      // =========================
      timeoutId = setTimeout(async () => {
        await updateDoc(roomRef, {
          winnerAt: Date.now()
        });
      }, 10000);
    };

    loadGame();

    return () => clearTimeout(timeoutId);
  }, [id, navigate]);

  const iconMap = {
    rock: "✊",
    paper: "✋",
    scissors: "✌"
  };

  if (!gameData) {
    return (
      <div className="game-page dark">
        <div className="game-container">
          Ładowanie wyniku...
        </div>
      </div>
    );
  }

  return (
    <div className="game-page dark">
      <div className="game-container">

        <div className="player-card">
          <h2>{gameData.player1?.name}</h2>
          <div className="choice-icon">
            {iconMap[gameData.choice1]}
          </div>
        </div>

        <div className="winner-box">
          {winnerText}
        </div>

        <div className="player-card">
          <h2>{gameData.player2?.name}</h2>
          <div className="choice-icon">
            {iconMap[gameData.choice2]}
          </div>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/rock-paper-scizzors")}
        >
          Powrót
        </button>

      </div>
    </div>
  );
}