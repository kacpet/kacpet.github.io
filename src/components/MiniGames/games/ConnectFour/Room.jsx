import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../base/firebase";
import "./Room.css";

export default function Room({ theme, language }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const playerId = location.state?.playerId;

  const [room, setRoom] = useState(null);
  const [role, setRole] = useState(null);

  // 🔥 TERAZ animacja jest w Firestore (nie lokalnie)
  const [animating, setAnimating] = useState(false);

  const boardRef = useRef(null);

  const ROWS = 6;
  const COLS = 7;

  useEffect(() => {
    const roomRef = doc(db, "connect4_rooms", id);

    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      setRoom(data);

      if (data.player1?.id === playerId) setRole("player1");
      if (data.player2?.id === playerId) setRole("player2");

      // 🔥 animating zależne od globalnego stanu
      setAnimating(false);
    });

    return () => unsub();
  }, [id, playerId]);

  const get = (board, r, c) =>
    r >= 0 && r < ROWS && c >= 0 && c < COLS
      ? board[r * COLS + c]
      : null;

  // =========================
  // WIN DETECTION
  // =========================
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
              lines.push(key);
            }
          }
        }
      }
    }

    return lines;
  };
    const dropPiece = async (col) => {
    if (!room || !role) return;
    if (room.currentTurn !== role) return;
    if (animating) return;
    if (room.winner) return;

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

    const roomRef = doc(db, "connect4_rooms", id);

    // 🔥 START ANIMACJI (GLOBALNA)
    await updateDoc(roomRef, {
      dropping: { row: 0, col, role }
    });

    // lokalna „symulacja” animacji
    await updateDoc(roomRef, {
        dropping: { row: targetRow, col, role }
    });

        // krótka pauza żeby CSS mógł „zagrać”
    await new Promise((res) => setTimeout(res, 450));

    board[targetRow * COLS + col] = role;

    const winLines = getWinningLines(board);
    const winner = winLines.length > 0 ? role : null;

    // 🔥 KONIEC ANIMACJI
    await updateDoc(roomRef, {
      board,
      winner,
      winningLines: winLines,
      dropping: null,

      currentTurn: winner
        ? null
        : role === "player1"
        ? "player2"
        : "player1",

      ...(winner && {
        winnerAt: Date.now(),
      }),
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

  if (!room) {
    return (
      <div className={`room-page-cf ${theme}`}>
        {language === "polish" ? "Ładowanie..." : "Loading..."}
      </div>
    );
  }
const buildLines = () => {
  if (!room?.winningLines || !boardRef.current) return [];

  const cells = boardRef.current.querySelectorAll(".cell-cf");

  return room.winningLines.map((line) => {
    const points = line.split("|").map((p) => {
      const [r, c] = p.split("-").map(Number);
      const index = r * COLS + c;
      const el = cells[index];

      if (!el) return { x: 0, y: 0 };

      const rect = el.getBoundingClientRect();
      const parentRect = boardRef.current.getBoundingClientRect();

      return {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top,
      };
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
  return (
    <div className={`room-page-cf ${theme}`}>
      <div className="board-wrapper-cf" ref={boardRef}>
        {/* =========================
            WIN LINES OVERLAY
        ========================= */}
        {buildLines().map((l, i) => {
          const dx = l.x2 - l.x1;
          const dy = l.y2 - l.y1;

          return (
            <div
              key={i}
              className="win-line-cf"
              style={{
                left: l.x1,
                top: l.y1,
                width: Math.hypot(dx, dy),
                transform: `rotate(${Math.atan2(dy, dx)}rad)`,
              }}
            />
          );
        })}

        {/* =========================
            BOARD
        ========================= */}
        <div className="board-cf">
          {Array.from({ length: ROWS }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => {
              const index = row * COLS + col;
              const cell = room.board?.[index];

              // 🔥 GLOBALNA ANIMACJA (DLA OBU GRACZY)
              const isDrop =
                room.dropping &&
                room.dropping.row === row &&
                room.dropping.col === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell-cf ${
                    isWinningCell(index) ? "win-cell-cf" : ""
                  }`}
                  onClick={() => dropPiece(col)}
                >
                  {cell && (
                    <div
                      className={`piece-cf ${
                        cell === "player1" ? "red-cf" : "yellow-cf"
                      }`}
                    />
                  )}

                  {isDrop && (
                    <div
                      className={`piece-cf drop-cf ${
                        room.dropping?.role === "player1"
                          ? "red-cf"
                          : "yellow-cf"
                      }`}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================
          INFO PANEL
      ========================= */}
      <div className="room-info-cf">
        <p>
          🔴 {language === "polish" ? "Gracz 1" : "Player 1"}:{" "}
          {room.player1?.name}
        </p>

        <p>
          🟡 {language === "polish" ? "Gracz 2" : "Player 2"}:{" "}
          {room.player2?.name}
        </p>

        {room.winner ? (
          <div className="winner-box-cf">
            <p className="winner-text">
              🏆 {language === "polish" ? "Wygrywa" : "Winner"}:{" "}
              {room.winner === "player1"
                ? room.player1?.name
                : room.player2?.name}
            </p>

            <button
              className="back-button-cf"
              onClick={() => navigate("/connect-four")}
            >
              {language === "polish" ? "Powrót" : "Back"}
            </button>
          </div>
        ) : (
          <p>
            {language === "polish" ? "Tura" : "Turn"}:{" "}
            {room.currentTurn === "player1"
              ? room.player1?.name
              : room.player2?.name}
          </p>
        )}
      </div>
    </div>
  );
}