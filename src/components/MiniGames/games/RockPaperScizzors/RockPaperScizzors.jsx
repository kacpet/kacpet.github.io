import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "./services/joinRoom";
import "./RockPaperScizzors.css";

export default function JoinPage({ theme, language }) {
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const [playerId] = useState(() => crypto.randomUUID());

    const navigate = useNavigate();

    const text = {
        polish: {
            title: "Dołącz do pokoju",
            nickname: "Twój nick",
            roomCode: "Kod pokoju",
            join: "Dołącz",
            connecting: "Łączenie...",
            roomFull: "Pokój jest pełny",
            error: "Błąd podczas dołączania do pokoju",
        },

        english: {
            title: "Join Room",
            nickname: "Your nickname",
            roomCode: "Room code",
            join: "Join",
            connecting: "Connecting...",
            roomFull: "Room is full",
            error: "Error while joining the room",
        },
    };

    const t = language === "english" ? text.english : text.polish;

    const handleJoin = async () => {
        if (!roomCode.trim() || !playerName.trim()) return;

        setLoading(true);

        try {
            const result = await joinRoom(roomCode.trim(), playerId, playerName.trim());

            if (result.role === "full") {
                alert(t.roomFull);
                setLoading(false);
                return;
            }

            navigate(`/rock-paper-scissors-game/${roomCode.trim()}`, {
                state: {
                    playerId,
                    playerName: playerName.trim(),
                    role: result.role,
                },
            });
        } catch (err) {
            console.error(err);
            alert(t.error);
        }

        setLoading(false);
    };

    return (
        <div className={`join-page ${theme} join-enter`}>
            <div className="join-container">
                <div className="join-header">
                    <h2>{t.title}</h2>
                </div>

                <div className="join-input-wrapper">
                    <input
                        className="join-input"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder={t.nickname}
                    />

                    <input
                        className="join-input"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder={t.roomCode}
                    />
                </div>

                <button className="join-button" onClick={handleJoin} disabled={loading}>
                    {loading ? t.connecting : t.join}
                </button>
            </div>
        </div>
    );
}
