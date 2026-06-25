import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../base/firebase";
import "./Room.css";

export default function Room() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const playerId = location.state?.playerId;
  const role = location.state?.role;

  const [room, setRoom] = useState(null);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState(null);

  const hasStartedRef = useRef(false);

  const readyField =
    role === "player1"
      ? "ready1"
      : role === "player2"
      ? "ready2"
      : null;

  const choiceField =
    role === "player1"
      ? "choice1"
      : role === "player2"
      ? "choice2"
      : null;

  // 🔒 brak danych → cofka
  useEffect(() => {
    if (!role || !playerId) {
      navigate("/join");
    }
  }, [role, playerId, navigate]);

  // 📡 realtime sync
  useEffect(() => {
    const ref = doc(db, "rooms", id);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      setRoom(data);

      // 🚀 start gry
      if (data.ready1 && data.ready2 && !hasStartedRef.current) {
        hasStartedRef.current = true;

        setTimeout(() => {
          navigate(`/game1/${id}`);
        }, 800);
      }
    });

    return () => unsub();
  }, [id, navigate]);

  // 🎯 wybór lokalny
  const handleChoice = (val) => {
    if (ready) return;
    setChoice(val);
  };

  // 🔒 READY = zapis do Firebase
  const handleReady = async () => {
    if (!readyField || !choiceField || !choice) return;

    const ref = doc(db, "rooms", id);

    await updateDoc(ref, {
      [choiceField]: choice,
      [readyField]: true
    });

    setReady(true);
  };

  if (!room) {
    return (
      <div className="room-page dark">
        <div className="room-container">
          <p className="room-status">Ładowanie pokoju...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-page dark">
      <div className="room-container">

        <h2 className="room-title">Room: {id}</h2>

        {/* PLAYERS */}
        <div className="room-card">
          <p>Player1: {room.player1?.name || "-"}</p>
          <p>Player2: {room.player2?.name || "-"}</p>
        </div>

        {/* RPS CHOICES */}
        <div className="room-card">
          <p>Wybierz opcję:</p>

          <div className="rps-buttons">

            <button
              className={`rps-btn ${choice === "rock" ? "selected" : ""}`}
              onClick={() => handleChoice("rock")}
              disabled={ready}
            >
              ✊
            </button>

            <button
              className={`rps-btn ${choice === "paper" ? "selected" : ""}`}
              onClick={() => handleChoice("paper")}
              disabled={ready}
            >
              ✋
            </button>

            <button
              className={`rps-btn ${choice === "scissors" ? "selected" : ""}`}
              onClick={() => handleChoice("scissors")}
              disabled={ready}
            >
              ✌
            </button>

          </div>
        </div>

        {/* READY */}
        {!readyField && (
          <p className="room-status">Brak przypisanej roli</p>
        )}

        {!ready && readyField && (
          <button
            className="room-button"
            onClick={handleReady}
            disabled={!choice}
          >
            READY
          </button>
        )}

        {/* STATUS */}
        <div className="room-card">
          <p>Ready P1: {String(room.ready1)}</p>
          <p>Ready P2: {String(room.ready2)}</p>
        </div>

        {/* START */}
        {room.ready1 && room.ready2 && (
          <h1 className="room-start">START 🚀</h1>
        )}

      </div>
    </div>
  );
}