import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "./services/joinRoom";
import "./ConnectFour.css";

export default function JoinPage({ theme, language }) {
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const [playerId] = useState(() => crypto.randomUUID());

    const navigate = useNavigate();

    const text = {
        polish: {
            title: "Dołącz do pokoju",
            namePlaceholder: "Twój nick",
            codePlaceholder: "Kod pokoju",
            joining: "Łączenie...",
            join: "Dołącz",
            fullRoom: "Pokój jest pełny",
            joinError: "Błąd podczas dołączania do pokoju",
        },

        english: {
            title: "Join room",
            namePlaceholder: "Your nickname",
            codePlaceholder: "Room code",
            joining: "Connecting...",
            join: "Join",
            fullRoom: "Room is full",
            joinError: "Error joining room",
        },
    };

    const t = text[language] || text.polish;

    const handleJoin = async () => {
        if (!roomCode.trim() || !playerName.trim()) return;

        setLoading(true);

        try {
            const result = await joinRoom(roomCode.trim(), playerId, playerName.trim());

            if (result.role === "full") {
                alert(t.fullRoom);
                setLoading(false);
                return;
            }

            navigate(`/connect-four-game/${roomCode.trim()}`, {
                state: {
                    playerId,
                    playerName: playerName.trim(),
                    role: result.role,
                },
            });
        } catch (err) {
            console.error(err);
            alert(t.joinError);
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
                        placeholder={t.namePlaceholder}
                    />

                    <input
                        className="join-input"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder={t.codePlaceholder}
                    />
                </div>

                <button className="join-button" onClick={handleJoin} disabled={loading}>
                    {loading ? t.joining : t.join}
                </button>
            </div>
        </div>
    );
}
