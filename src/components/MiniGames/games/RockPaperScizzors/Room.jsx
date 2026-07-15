import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import { db } from "../../base/firebase";

import "./Room.css";

export default function Room({ theme, language }) {
    const { id } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const playerId = location.state?.playerId;

    const role = location.state?.role;

    const [room, setRoom] = useState(null);

    const [ready, setReady] = useState(false);

    const [choice, setChoice] = useState(null);

    const hasStartedRef = useRef(false);

    const text = {
        polish: {
            loading: "Ładowanie pokoju...",

            room: "Pokój",

            player1: "Gracz 1",

            player2: "Gracz 2",

            choose: "Wybierz opcję:",

            noRole: "Brak przypisanej roli",

            ready: "GOTOWY",

            readyP1: "Gracz 1",

            readyP2: "Gracz 2",

            readyStatus: "Gotowy",

            notReadyStatus: "Niegotowy",

            start: "START 🚀",
        },

        english: {
            loading: "Loading room...",

            room: "Room",

            player1: "Player 1",

            player2: "Player 2",

            choose: "Choose an option:",

            noRole: "No assigned role",

            ready: "READY",

            readyP1: "Player 1",

            readyP2: "Player 2",

            readyStatus: "Ready",

            notReadyStatus: "Not Ready",

            start: "START 🚀",
        },
    };

    const t = language === "english" ? text.english : text.polish;

    const readyField = role === "player1" ? "ready1" : role === "player2" ? "ready2" : null;

    const choiceField = role === "player1" ? "choice1" : role === "player2" ? "choice2" : null;

    useEffect(() => {
        if (!role || !playerId) {
            navigate("/join");
        }
    }, [role, playerId, navigate]);

    useEffect(() => {
        if (!id) return;

        const roomRef = doc(db, "rooms", id);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (!snapshot.exists()) return;

            const data = snapshot.data();

            setRoom(data);

            if (data.ready1 && data.ready2 && !hasStartedRef.current) {
                hasStartedRef.current = true;

                setTimeout(() => {
                    navigate(`/rock-paper-scissors-result/${id}`);
                }, 800);
            }
        });

        return () => unsubscribe();
    }, [id, navigate]);

    const handleChoice = (value) => {
        if (ready) return;

        setChoice(value);
    };

    const handleReady = async () => {
        if (!readyField || !choiceField || !choice) return;

        const roomRef = doc(db, "rooms", id);

        await updateDoc(roomRef, {
            [choiceField]: choice,

            [readyField]: true,
        });

        setReady(true);
    };

    if (!room) {
        return (
            <div className={`room-page-rps ${theme} room-enter-rps`}>
                <div className="room-container-rps">
                    <p className="room-status-rps">{t.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`room-page-rps ${theme} room-enter-rps`}>
            <div className="room-container-rps">
                <h2 className="room-title-rps">
                    {t.room}: {id}
                </h2>

                <div className="room-card-rps">
                    <p>
                        {t.player1}: {room.player1?.name || "-"}
                    </p>

                    <p>
                        {t.player2}: {room.player2?.name || "-"}
                    </p>
                </div>

                <div className="room-card-rps">
                    <p>{t.choose}</p>

                    <div className="rps-buttons-rps">
                        <button
                            className={`rps-btn-rps ${choice === "rock" ? "selected-rps" : ""}`}

                            onClick={() => handleChoice("rock")}

                            disabled={ready}
                        >
                            ✊
                        </button>

                        <button
                            className={`rps-btn-rps ${choice === "paper" ? "selected-rps" : ""}`}

                            onClick={() => handleChoice("paper")}

                            disabled={ready}
                        >
                            ✋
                        </button>

                        <button
                            className={`rps-btn-rps ${choice === "scissors" ? "selected-rps" : ""}`}

                            onClick={() => handleChoice("scissors")}

                            disabled={ready}
                        >
                            ✌
                        </button>
                    </div>
                </div>

                {!readyField && <p className="room-status-rps">{t.noRole}</p>}

                {!ready && readyField && (
                    <button
                        className="room-button-rps"

                        onClick={handleReady}

                        disabled={!choice}
                    >
                        {t.ready}
                    </button>
                )}

                <div className="room-card-rps">
                    <p>
                        {t.readyP1}: {room.ready1 ? t.readyStatus : t.notReadyStatus}
                    </p>

                    <p>
                        {t.readyP2}: {room.ready2 ? t.readyStatus : t.notReadyStatus}
                    </p>
                </div>

                {room.ready1 && room.ready2 && <h1 className="room-start-rps">{t.start}</h1>}
            </div>
        </div>
    );
}
