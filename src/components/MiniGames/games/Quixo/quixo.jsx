import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "./services/joinRoom"; // zakładam quixo joinRoom
import "./quixo.css";

export default function JoinPage({ theme }) {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

  const [playerId] = useState(() => crypto.randomUUID());

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomCode.trim() || !playerName.trim()) return;

    setLoading(true);

    try {
      const result = await joinRoom(
        roomCode.trim(),
        playerId,
        playerName.trim()
      );

      if (result.role === "full") {
        alert("Pokój jest pełny");
        setLoading(false);
        return;
      }

      navigate(`/quixo-game/${roomCode.trim()}`, {
        state: {
          playerId,
          playerName: playerName.trim(),
          role: result.role,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dołączania do pokoju");
    }

    setLoading(false);
  };

  return (
    <div className={`join-page ${theme} join-enter`}>
      <div className="join-container">
        <div className="join-header">
          <h2>Dołącz do pokoju</h2>
        </div>

        <div className="join-input-wrapper">
          <input
            className="join-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Twój nick"
          />

          <input
            className="join-input"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Kod pokoju"
          />
        </div>

        <button
          className="join-button"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Łączenie..." : "Dołącz"}
        </button>
      </div>
    </div>
  );
}