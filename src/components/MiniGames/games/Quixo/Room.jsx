import { useEffect, useState, useRef, useCallback } from "react";

import { useParams, useLocation, useNavigate } from "react-router-dom";

import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../base/firebase";

import "./Room.css";

export default function QuixoRoom({ theme, language }) {
    const { id } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const playerId = location.state?.playerId;

    const SIZE = 5;

    const [room, setRoom] = useState(null);

    const [role, setRole] = useState(null);

    const [selectedEdge, setSelectedEdge] = useState(null);

    const [selectedDirection, setSelectedDirection] = useState(null);

    const [pushing, setPushing] = useState(false);

    const [movingPiece, setMovingPiece] = useState(null);

    const [moveAnimation, setMoveAnimation] = useState(null);

    const boardRef = useRef(null);

    const directionLabels = {
        polish: {
            up: "Góra",

            down: "Dół",

            left: "Lewo",

            right: "Prawo",
        },

        english: {
            up: "Up",

            down: "Down",

            left: "Left",

            right: "Right",
        },
    };

    useEffect(() => {
        if (!id) return;

        const roomRef = doc(db, "quixo_rooms", id);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (!snapshot.exists()) return;

            const data = snapshot.data();

            setRoom(data);

            if (data.player1?.id === playerId) {
                setRole("player1");
            } else if (data.player2?.id === playerId) {
                setRole("player2");
            } else {
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, [id, playerId]);

    const createEmptyBoard = useCallback(() => {
        return Array(SIZE * SIZE).fill(null);
    }, []);

    const cloneBoard = useCallback(
        (board) => {
            if (Array.isArray(board)) {
                return [...board];
            }

            return createEmptyBoard();
        },
        [createEmptyBoard]
    );

    const index = useCallback((row, col) => {
        return row * SIZE + col;
    }, []);

    const get = useCallback(
        (board, row, col) => {
            if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) {
                return null;
            }

            return board[index(row, col)];
        },
        [index]
    );

    const isEdge = useCallback((row, col) => {
        return row === 0 || col === 0 || row === SIZE - 1 || col === SIZE - 1;
    }, []);

    const isCorner = useCallback((row, col) => {
        return (
            (row === 0 && col === 0) ||
            (row === 0 && col === SIZE - 1) ||
            (row === SIZE - 1 && col === 0) ||
            (row === SIZE - 1 && col === SIZE - 1)
        );
    }, []);

    const isValidPick = useCallback(
        (piece) => {
            return piece === null || piece === role;
        },
        [role]
    );

    const getMoveDirections = useCallback(
        (row, col) => {
            const directions = [];

            const top = row === 0;

            const bottom = row === SIZE - 1;

            const left = col === 0;

            const right = col === SIZE - 1;

            if (isCorner(row, col)) {
                if (top && left) return ["up", "left"];

                if (top && right) return ["up", "right"];

                if (bottom && left) return ["down", "left"];

                if (bottom && right) return ["down", "right"];
            }

            if (top) {
                directions.push("up", "left", "right");
            } else if (bottom) {
                directions.push("down", "left", "right");
            } else if (left) {
                directions.push("left", "up", "down");
            } else if (right) {
                directions.push("right", "up", "down");
            }

            return directions;
        },
        [isCorner]
    );

    const pushPiece = useCallback(
        (board, row, col, direction, player) => {
            const newBoard = cloneBoard(board);

            let pickedPiece = newBoard[index(row, col)];

            if (pickedPiece === null) {
                pickedPiece = player;
            }

            newBoard[index(row, col)] = null;

            if (direction === "down") {
                for (let r = row; r > 0; r--) {
                    newBoard[index(r, col)] = newBoard[index(r - 1, col)];
                }

                newBoard[index(0, col)] = pickedPiece;
            }

            if (direction === "up") {
                for (let r = row; r < SIZE - 1; r++) {
                    newBoard[index(r, col)] = newBoard[index(r + 1, col)];
                }

                newBoard[index(SIZE - 1, col)] = pickedPiece;
            }

            if (direction === "right") {
                for (let c = col; c > 0; c--) {
                    newBoard[index(row, c)] = newBoard[index(row, c - 1)];
                }

                newBoard[index(row, 0)] = pickedPiece;
            }

            if (direction === "left") {
                for (let c = col; c < SIZE - 1; c++) {
                    newBoard[index(row, c)] = newBoard[index(row, c + 1)];
                }

                newBoard[index(row, SIZE - 1)] = pickedPiece;
            }

            return newBoard;
        },

        [cloneBoard, index]
    );

    const getWinningLines = useCallback(
        (board) => {
            const result = [];

            const directions = [
                [0, 1],

                [1, 0],

                [1, 1],

                [1, -1],
            ];

            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    const player = get(board, row, col);

                    if (!player) continue;

                    for (const [dr, dc] of directions) {
                        const cells = [];

                        let r = row;

                        let c = col;

                        while (r >= 0 && c >= 0 && r < SIZE && c < SIZE && get(board, r, c) === player) {
                            cells.push(`${r}-${c}`);

                            r += dr;

                            c += dc;
                        }

                        if (cells.length >= SIZE) {
                            result.push({
                                player,

                                cells: cells.slice(0, SIZE),
                            });
                        }
                    }
                }
            }

            return result;
        },
        [get]
    );

    const determineWinner = useCallback(
        (board, currentPlayer) => {
            const lines = getWinningLines(board);

            const player1Win = lines.some((line) => line.player === "player1");

            const player2Win = lines.some((line) => line.player === "player2");

            if (player1Win && player2Win) {
                return currentPlayer === "player1" ? "player2" : "player1";
            }

            if (player1Win) {
                return "player1";
            }

            if (player2Win) {
                return "player2";
            }

            return null;
        },

        [getWinningLines]
    );

    const handleCellClick = useCallback(
        (row, col) => {
            if (!room) return;

            if (!role) return;

            if (room.winner) return;

            if (room.currentTurn !== role) return;

            if (pushing) return;

            if (!isEdge(row, col)) return;

            const board = cloneBoard(room.board);

            const piece = board[index(row, col)];

            if (!isValidPick(piece)) {
                return;
            }

            if (selectedEdge && selectedEdge.row === row && selectedEdge.col === col) {
                return;
            }

            setSelectedEdge({
                row,

                col,
            });

            setSelectedDirection(null);
        },

        [room, role, pushing, cloneBoard, index, isEdge, isValidPick, selectedEdge]
    );

    const getSelectedDirections = useCallback(() => {
        if (!selectedEdge) {
            return [];
        }

        return getMoveDirections(selectedEdge.row, selectedEdge.col);
    }, [selectedEdge, getMoveDirections]);

    const chooseDirection = (direction) => {
        if (!selectedEdge) return;

        setSelectedDirection(direction);
    };

    const startPushAnimation = (row, col, direction) => {
        setMovingPiece({
            row,

            col,
        });

        setMoveAnimation(direction);

        setPushing(true);
    };

    const endPushAnimation = () => {
        setMovingPiece(null);

        setMoveAnimation(null);

        setPushing(false);
    };

    const getAnimationClass = (row, col) => {
        if (!movingPiece) {
            return "";
        }

        if (movingPiece.row === row && movingPiece.col === col) {
            return `move-${moveAnimation}-q`;
        }

        return "";
    };

    const executeMove = async () => {
        if (!selectedEdge || !selectedDirection || !room || !role || pushing) {
            return;
        }

        const { row, col } = selectedEdge;

        const oldBoard = cloneBoard(room.board);

        startPushAnimation(row, col, selectedDirection);

        const newBoard = pushPiece(oldBoard, row, col, selectedDirection, role);

        const winningLines = getWinningLines(newBoard);

        const winner = determineWinner(newBoard, role);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const roomRef = doc(db, "quixo_rooms", id);

        await updateDoc(roomRef, {
            board: newBoard,

            winningLines,

            winner,

            currentTurn: winner ? null : role === "player1" ? "player2" : "player1",

            ...(winner && {
                winnerAt: serverTimestamp(),
            }),
        });

        setSelectedEdge(null);

        setSelectedDirection(null);

        setTimeout(() => {
            endPushAnimation();
        }, 450);
    };

    const confirmMove = () => {
        if (!selectedDirection) {
            return;
        }

        executeMove();
    };

    const getWinnerName = () => {
        if (!room?.winner) {
            return "";
        }

        if (room.winner === "player1") {
            return room.player1?.name || "Player 1";
        }

        return room.player2?.name || "Player 2";
    };

    if (!room) {
        return <div className={`room-page-q ${theme}`}>{language === "polish" ? "Ładowanie..." : "Loading..."}</div>;
    }

    return (
        <div className={`room-page-q ${theme}`}>
            <div className="board-wrapper-q" ref={boardRef}>
                <div
                    className={["board-q", "quixo-board-q", theme, pushing ? "pushing-q" : ""].join(" ")}

                    style={{
                        gridTemplateColumns: `repeat(${SIZE},1fr)`,
                    }}
                >
                    {Array.from({
                        length: SIZE,
                    }).map((_, row) =>
                        Array.from({
                            length: SIZE,
                        }).map((_, col) => {
                            const cell = room.board?.[index(row, col)];

                            const selected = selectedEdge?.row === row && selectedEdge?.col === col;

                            return (
                                <div
                                    key={`${row}-${col}`}

                                    className={[
                                        "cell-q",

                                        isEdge(row, col) ? "edge-q" : "",

                                        selected ? "selected-q" : "",

                                        getAnimationClass(row, col),
                                    ].join(" ")}

                                    onClick={() => handleCellClick(row, col)}
                                >
                                    {cell && (
                                        <div className={`piece-q ${cell === "player1" ? "x-q" : "o-q"}`}>
                                            {cell === "player1" ? "X" : "O"}
                                        </div>
                                    )}

                                    {selected && !pushing && (
                                        <div className="direction-bar-q">
                                            {getSelectedDirections().map((direction) => (
                                                <button
                                                    key={direction}

                                                    className={[
                                                        "dir-btn-q",

                                                        selectedDirection === direction ? "active-q" : "",
                                                    ].join(" ")}

                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        chooseDirection(direction);
                                                    }}
                                                >
                                                    {directionLabels[language]?.[direction] || direction}
                                                </button>
                                            ))}

                                            {selectedDirection && (
                                                <button
                                                    className="confirm-btn-q"

                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        confirmMove();
                                                    }}
                                                >
                                                    {language === "polish" ? "Wsuń" : "Push"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className={`room-info-q ${theme}`}>
                <p>
                    🔴
                    {language === "polish" ? " Gracz 1:" : " Player 1:"} {room.player1?.name || "-"}
                </p>

                <p>
                    🟡
                    {language === "polish" ? " Gracz 2:" : " Player 2:"} {room.player2?.name || "-"}
                </p>

                {room.winner ? (
                    <div className="winner-box-q">
                        <p className="winner-text-q">
                            🏆
                            {language === "polish" ? " Wygrywa:" : " Winner:"} {getWinnerName()}
                        </p>

                        <button
                            className="back-button-q"

                            onClick={() => navigate("/")}
                        >
                            {language === "polish" ? "Powrót" : "Back"}
                        </button>
                    </div>
                ) : (
                    <p>
                        {language === "polish" ? "Tura:" : "Turn:"}{" "}
                        {room.currentTurn === "player1" ? room.player1?.name : room.player2?.name}
                    </p>
                )}
            </div>
        </div>
    );
}