import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../base/firebase";
import { useNavigate } from "react-router-dom";
import "./Room.css";

export default function Room() {
  const { id } = useParams();
  const location = useLocation();

  const navigate = useNavigate();
  const playerId = location.state?.playerId;

  const [room, setRoom] = useState(null);
  const [role, setRole] = useState(null);
  const [dropping, setDropping] = useState(null);
  const [animating, setAnimating] = useState(false);

  const ROWS = 6;
  const COLS = 7;

  const getCenter = (r, c) => {
  const CELL = 90;
  const GAP = 12;
  const PADDING = 30;

  const x = PADDING + c * (CELL + GAP) + CELL / 2;
  const y = PADDING + r * (CELL + GAP) + CELL / 2;

  return { x, y };
};
  useEffect(() => {
    const roomRef = doc(db, "connect4_rooms", id);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      setRoom(data);

      if (data.player1?.id === playerId) setRole("player1");
      if (data.player2?.id === playerId) setRole("player2");
    });

    return () => unsub();
  }, [id, playerId]);

  const get = (board, r, c) =>
    r >= 0 && r < ROWS && c >= 0 && c < COLS
      ? board[r * COLS + c]
      : null;

  // ✅ FIRESTORE SAFE: tylko stringi, żadnych array-of-array
  const getWinningLines = (board) => {
    const lines = [];
    const seen = new Set();

    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const player = get(board, r, c);
        if (!player) continue;

        for (const [dr, dc] of directions) {
          const cells = [];

          for (let i = 0; i < 6; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;

            if (get(board, nr, nc) === player) {
              cells.push(`${nr}-${nc}`);
            } else {
              break;
            }
          }

          if (cells.length >= 4) {
            const key = cells.join("|");

            if (!seen.has(key)) {
              seen.add(key);
              lines.push(key); // 🔥 STRING, nie tablica
            }
          }
        }
      }
    }

    return lines; // string[]
  };
  const buildLines = () => {
  if (!room?.winningLines) return [];

  return room.winningLines.map((line) => {
    const points = line.split("|").map((p) => {
      const [r, c] = p.split("-").map(Number);
      return getCenter(r, c);
    });

    const first = points[0];
    const last = points[points.length - 1];

    return {
      x1: first.x,
      y1: first.y,
      x2: last.x,
      y2: last.y,
    };
  });
};
  const dropPiece = async (col) => {
    if (!room || !role) return;
    if (room.currentTurn !== role) return;
    if (animating) return;

    const board = Array.isArray(room.board)
      ? [...room.board]
      : Array(42).fill(null);

    let targetRow = -1;

    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r * COLS + col] == null) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return;

    setAnimating(true);

    for (let r = 0; r <= targetRow; r++) {
      setDropping({ row: r, col, role });
      await new Promise((res) => setTimeout(res, 35));
    }

    board[targetRow * COLS + col] = role;

    const winLines = getWinningLines(board);
    const winner = winLines.length > 0 ? role : null;

    setTimeout(() => setDropping(null), 120);

    await updateDoc(doc(db, "connect4_rooms", id), {
      board,
      winner,
      winningLines: winLines,
      currentTurn: winner
        ? null
        : role === "player1"
        ? "player2"
        : "player1",
    });

    setAnimating(false);
  };

  const isWinningCell = (index) => {
    if (!room?.winningLines) return false;

    const r = Math.floor(index / COLS);
    const c = index % COLS;
    const key = `${r}-${c}`;

    return room.winningLines.some((line) =>
      line.split("|").includes(key)
    );
  };

  if (!room) return <div>Ładowanie...</div>;

  return (
    <div className="room-page">
      <div className="board-wrapper">
            {buildLines().map((l, i) => (
                <div
                key={i}
                className="win-line"
                style={{
                    left: l.x1,
                    top: l.y1,
                    width: Math.hypot(l.x2 - l.x1, l.y2 - l.y1),
                    transform: `rotate(${Math.atan2(
                    l.y2 - l.y1,
                    l.x2 - l.x1
                    )}rad)`,
                }}
                />
            ))}
        <div className="board">
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => {
              const index = row * COLS + col;
              const cell = room.board?.[index];

              const isDrop =
                dropping &&
                dropping.row === row &&
                dropping.col === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${
                    isWinningCell(index) ? "win-cell" : ""
                  }`}
                  onClick={() => dropPiece(col)}
                >
                  {cell && (
                    <div
                      className={`piece ${
                        cell === "player1" ? "red" : "yellow"
                      }`}
                    />
                  )}

                  {isDrop && (
                    <div
                      className={`piece drop ${
                        role === "player1" ? "red" : "yellow"
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="room-info">
        <p>🔴 {room.player1?.name}</p>
        <p>🟡 {room.player2?.name}</p>

        {room.winner ? (
          <div className="winner-box">
            <p className="winner-text">
              🏆 Wygrywa:{" "}
              {room.winner === "player1"
                ? room.player1?.name
                : room.player2?.name}
            </p>

            <button
              className="back-button"
              onClick={() => navigate("/connect-four")}
            >
              Powrót
            </button>
          </div>
        ) : (
          <p>
            Tura:{" "}
            {room.currentTurn === "player1"
              ? room.player1?.name
              : room.player2?.name}
          </p>
        )}
      </div>
    </div>
  );
}