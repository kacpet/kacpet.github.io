import { useEffect, useState, useRef } from "react"

import { useParams, useLocation, useNavigate } from "react-router-dom"

import { doc, onSnapshot, updateDoc } from "firebase/firestore"

import { db } from "../../base/firebase"
import "./Room.css"

export default function QuixoRoom({ theme, language }) {
  const { id } = useParams()

  const location = useLocation()

  const navigate = useNavigate()

  const playerId = location.state?.playerId

  const SIZE = 5

  const [room, setRoom] = useState(null)

  const [role, setRole] = useState(null)

  // aktualnie wybrany klocek

  const [selectedEdge, setSelectedEdge] = useState(null)

  // kierunek wsunięcia

  const [selectedDirection, setSelectedDirection] = useState(null)

  // animacja ruchu

  const [pushing, setPushing] = useState(false)

  const [movingPiece, setMovingPiece] = useState(null)

  const [moveAnimation, setMoveAnimation] = useState(null)

  const boardRef = useRef(null)

  // =========================
  // LANGUAGE
  // =========================

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
  }

  // =========================
  // FIRESTORE SYNC
  // =========================

  useEffect(() => {
    if (!id) return

    const roomRef = doc(db, "quixo_rooms", id)

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) return

      const data = snapshot.data()

      setRoom(data)

      if (data.player1?.id === playerId) {
        setRole("player1")
      } else if (data.player2?.id === playerId) {
        setRole("player2")
      } else {
        setRole(null)
      }
    })

    return () => unsubscribe()
  }, [id, playerId])

  // =========================
  // HELPERS
  // =========================

  const createEmptyBoard = () => {
    return Array(SIZE * SIZE).fill(null)
  }

  const cloneBoard = (board) => {
    if (Array.isArray(board)) {
      return [...board]
    }

    return createEmptyBoard()
  }

  const index = (row, col) => {
    return row * SIZE + col
  }

  const get = (board, row, col) => {
    if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) {
      return null
    }

    return board[index(row, col)]
  }

  const isEdge = (row, col) => {
    return row === 0 || col === 0 || row === SIZE - 1 || col === SIZE - 1
  }

  const isCorner = (row, col) => {
    return (
      (row === 0 && col === 0) ||
      (row === 0 && col === SIZE - 1) ||
      (row === SIZE - 1 && col === 0) ||
      (row === SIZE - 1 && col === SIZE - 1)
    )
  }

  const isValidPick = (piece) => {
    return piece === null || piece === role
  }
  // =========================
  // AVAILABLE DIRECTIONS
  // =========================
  //
  // Kierunek oznacza stronę,
  // z której klocek jest WSUWANY.
  //
  // down  -> wsuwanie od góry
  // up    -> wsuwanie od dołu
  // right -> wsuwanie od lewej
  // left  -> wsuwanie od prawej
  //
  // Nie można wsunąć klocka z tej samej strony,
  // z której został zabrany.
  //

const getMoveDirections = (row, col) => {
  const directions = []

  const top = row === 0
  const bottom = row === SIZE - 1
  const left = col === 0
  const right = col === SIZE - 1


  // =========================
  // NAROŻNIKI
  // zawsze 2 kierunki
  // =========================

  if (isCorner(row, col)) {

    if (top && left) {
      return ["up", "left"]
    }

    if (top && right) {
      return ["up", "right"]
    }

    if (bottom && left) {
      return ["down", "left"]
    }

    if (bottom && right) {
      return ["down", "right"]
    }

  }


  // =========================
  // GÓRNA KRAWĘDŹ
  // brak "down"
  // =========================

  if (top) {
    directions.push(
      "up",
      "left",
      "right"
    )
  }


  // =========================
  // DOLNA KRAWĘDŹ
  // brak "up"
  // =========================

  else if (bottom) {
    directions.push(
      "down",
      "left",
      "right"
    )
  }


  // =========================
  // LEWA KRAWĘDŹ
  // brak "right"
  // =========================

  else if (left) {
    directions.push(
      "left",
      "up",
      "down"
    )
  }


  // =========================
  // PRAWA KRAWĘDŹ
  // brak "left"
  // =========================

  else if (right) {
    directions.push(
      "right",
      "up",
      "down"
    )
  }


  return directions
}

  // =========================
  // PUSH HELPERS
  // =========================

  const shiftColumnDown = (board, col, fromRow) => {
    const newBoard = cloneBoard(board)

    /*
      Przesuwamy tylko pola
      od góry do miejsca wyjęcia.

      Pola poniżej miejsca wyjęcia
      NIE ruszają się.
    */

    for (let row = fromRow; row > 0; row--) {
      newBoard[index(row, col)] = newBoard[index(row - 1, col)]
    }

    return newBoard
  }

  const shiftColumnUp = (board, col, fromRow) => {
    const newBoard = cloneBoard(board)

    /*
      Przesuwamy tylko pola
      od dołu do miejsca wyjęcia
    */

    for (let row = fromRow; row < SIZE - 1; row++) {
      newBoard[index(row, col)] = newBoard[index(row + 1, col)]
    }

    return newBoard
  }

  const shiftRowRight = (board, row, fromCol) => {
    const newBoard = cloneBoard(board)

    /*
      Przesuwamy tylko pola
      od lewej strony
      do miejsca wyjęcia
    */

    for (let col = fromCol; col > 0; col--) {
      newBoard[index(row, col)] = newBoard[index(row, col - 1)]
    }

    return newBoard
  }

  const shiftRowLeft = (board, row, fromCol) => {
    const newBoard = cloneBoard(board)

    /*
      Przesuwamy tylko pola
      od prawej strony
      do miejsca wyjęcia
    */

    for (let col = fromCol; col < SIZE - 1; col++) {
      newBoard[index(row, col)] = newBoard[index(row, col + 1)]
    }

    return newBoard
  }
  // =========================
  // QUIXO PUSH ENGINE
  // =========================

  const pushPiece = (board, row, col, direction, player) => {
    let newBoard = cloneBoard(board)

    /*
      Pobieramy wybrany klocek.

      Jeżeli pole było puste,
      gracz wkłada swój klocek.
    */

    let pickedPiece = newBoard[index(row,col)]
    
    if(pickedPiece === null){
      pickedPiece = player
    }
    /*
      Usuwamy klocek z planszy

      W tym momencie istnieje
      jedno puste miejsce.
    */

    newBoard[index(row, col)] = null

    // =========================
    // WSUNIĘCIE Z GÓRY
    // =========================

    if (direction === "down") {
      /*
        Przesuwamy tylko część
        NAD wyjętym klockiem.

        np.

        X
        A
        B <- zabrany

        wynik:

        X
        A
        klocek


      */

      for (let r = row; r > 0; r--) {
        newBoard[index(r, col)] = newBoard[index(r - 1, col)]
      }

      newBoard[index(0, col)] = pickedPiece
    }

    // =========================
    // WSUNIĘCIE Z DOŁU
    // =========================

    if (direction === "up") {
      for (let r = row; r < SIZE - 1; r++) {
        newBoard[index(r, col)] = newBoard[index(r + 1, col)]
      }

      newBoard[index(SIZE - 1, col)] = pickedPiece
    }

    // =========================
    // WSUNIĘCIE Z LEWEJ
    // =========================

    if (direction === "right") {
      for (let c = col; c > 0; c--) {
        newBoard[index(row, c)] = newBoard[index(row, c - 1)]
      }

      newBoard[index(row, 0)] = pickedPiece
    }

    // =========================
    // WSUNIĘCIE Z PRAWEJ
    // =========================

    if (direction === "left") {
      for (let c = col; c < SIZE - 1; c++) {
        newBoard[index(row, c)] = newBoard[index(row, c + 1)]
      }

      newBoard[index(row, SIZE - 1)] = pickedPiece
    }

    return newBoard
  }

  // =========================
  // VALID MOVE CHECK
  // =========================


  // =========================
  // SELECT PIECE
  // =========================

  const handleCellClick = (row, col) => {
    if (!room) return

    if (!role) return

    if (room.winner) return

    if (room.currentTurn !== role) return

    if (pushing) return

    /*
      Gracz może wybrać
      tylko krawędź
    */

    if (!isEdge(row, col)) return

    const board = cloneBoard(room.board)

    const piece = board[index(row, col)]

    /*
      Można wyjąć:
      - pusty klocek
      - własny klocek

      Nie można zabrać
      przeciwnika.
    */

    if (!isValidPick(piece)) {
      return
    }

    /*
      Jeżeli kliknięto
      aktualnie wybrany klocek
      nic nie robimy
    */

    if (selectedEdge && selectedEdge.row === row && selectedEdge.col === col) {
      return
    }

    /*
      Ustawiamy nowy klocek
    */

    setSelectedEdge({
      row,

      col,
    })

    /*
      Resetujemy kierunek
    */

    setSelectedDirection(null)
  }

  // =========================
  // GET SELECTED DIRECTIONS
  // =========================

const getSelectedDirections = () => {
  if (!selectedEdge) return []

  const {
    row,
    col,
  } = selectedEdge

  return getMoveDirections(row,col)
}

  // =========================
  // SELECT DIRECTION
  // =========================

  const chooseDirection = (direction) => {
    if (!selectedEdge) return

    setSelectedDirection(direction)
  }
  // =========================
  // EXECUTE MOVE
  // =========================

  const startPushAnimation = (row, col, direction) => {
  setMovingPiece({
    row,

    col,
  })

  setMoveAnimation(direction)

  setPushing(true)
}

// =========================
// END MOVE ANIMATION
// =========================

  const endPushAnimation = () => {
    setMovingPiece(null)

    setMoveAnimation(null)

    setPushing(false)
  }

  // =========================
  // ANIMATION CLASS
  // =========================

  const getAnimationClass = (row, col) => {
    if (!movingPiece) return ""

    if (movingPiece.row === row && movingPiece.col === col) {
      return `move-${moveAnimation}`
    }

    return ""
  }

  const executeMove = async () => {
    if (!selectedEdge || !selectedDirection || !room || !role || pushing) {
      return
    }

    const {
      row,

      col,
    } = selectedEdge

    const oldBoard = cloneBoard(room.board)
    /*
      BLOKADA PODCZAS RUCHU
    */
      startPushAnimation(
      row,
      col,
      selectedDirection
    )


    const newBoard = pushPiece(
      oldBoard,
      row,
      col,
      selectedDirection,
      role
    )
    /*
      SPRAWDZENIE WYGRANEJ
    */

    const winningLines = getWinningLines(newBoard)

    const winner = winningLines.length > 0 ? role : null

    /*
      Krótka animacja
      przed zapisem
    */

    await new Promise((resolve) => setTimeout(resolve, 500))

    const roomRef = doc(db, "quixo_rooms", id)

    await updateDoc(roomRef, {
      board: newBoard,

      winningLines,

      winner,

      currentTurn: winner ? null : role === "player1" ? "player2" : "player1",

      ...(winner && {
        winnerAt: Date.now(),
      }),
    })

    /*
      Czyścimy wybór
    */

   setSelectedEdge(null)
   setSelectedDirection(null)


   setTimeout(()=>{

    endPushAnimation()

  },450)
  }

  // =========================
  // CONFIRM BUTTON HANDLER
  // =========================

  const confirmMove = () => {
    if (!selectedDirection) return

    executeMove()
  }
  // =========================
// ANIMATION STATE
// =========================



// =========================
// START MOVE ANIMATION
// =========================


  // =========================
  // WIN CHECK
  // =========================

  const getWinningLines = (board) => {
    const result = []

    const directions = [
      [0, 1], // poziomo

      [1, 0], // pionowo

      [1, 1], // skos prawy dół

      [1, -1], // skos lewy dół
    ]

    const used = new Set()

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const player = get(board, row, col)

        if (!player) continue

        for (const [dr, dc] of directions) {
          const cells = []

          let r = row

          let c = col

          while (
            r >= 0 &&
            c >= 0 &&
            r < SIZE &&
            c < SIZE &&
            get(board, r, c) === player
          ) {
            cells.push(`${r}-${c}`)

            r += dr

            c += dc
          }

          if (cells.length >= SIZE) {
            /*
              Bierzemy pierwsze 5 pól.

              W Quixo plansza ma 5x5,
              więc każda pełna linia
              ma dokładnie 5.
            */

            const line = cells.slice(0, SIZE).join("|")

            if (!used.has(line)) {
              used.add(line)

              result.push(line)
            }
          }
        }
      }
    }

    return result
  }

  // =========================
  // CHECK WINNER NAME
  // =========================

  const getWinnerName = () => {
    if (!room?.winner) return ""

    if (room.winner === "player1") {
      return room.player1?.name || "Player 1"
    }

    return room.player2?.name || "Player 2"
  }
  // =========================
  // RENDER CELL
  // =========================

  const renderCell = (cell, row, col) => {
    const key = `${row}-${col}`

    const selected = selectedEdge?.row === row && selectedEdge?.col === col

    const availableDirections = selected ? getSelectedDirections() : []

    return (
      <div
        key={key}

        className={[
          "cell",

          isEdge(row, col) ? "edge" : "",

          selected ? "selected" : "",

          getAnimationClass(row, col),

          pushing && selected ? "pushing-piece-cell" : "",
        ].join(" ")}

        onClick={() => handleCellClick(row, col)}
      >
        {cell && (
          <div className={`piece ${cell === "player1" ? "x" : "o"}`}>
            {cell === "player1" ? "X" : "O"}
          </div>
        )}

        {selected && !pushing && (
          <div className="direction-bar">
            {availableDirections.map((direction) => (
              <button
                key={direction}

                className={[
                  "dir-btn",

                  selectedDirection === direction ? "active" : "",
                ].join(" ")}

                onClick={(event) => {
                  event.stopPropagation()

                  chooseDirection(direction)
                }}
              >
                {directionLabels[language]?.[direction] || direction}
              </button>
            ))}

            {selectedDirection && (
              <button
                className="confirm-btn"

                onClick={(event) => {
                  event.stopPropagation()

                  confirmMove()
                }}
              >
                {language === "polish" ? "Wsuń" : "Push"}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
  // =========================
  // BOARD RENDER
  // =========================

  const renderBoard = () => {
    const board = Array.isArray(room?.board)
      ? room.board
      : Array(SIZE * SIZE).fill(null)

    return Array.from({
      length: SIZE,
    }).map((_, row) =>
      Array.from({
        length: SIZE,
      }).map((_, col) => {
        const cell = board[index(row, col)]

        return renderCell(cell, row, col)
      }),
    )
  }

  // =========================
  // LOADING SCREEN
  // =========================

  if (!room) {
    return (
      <div className={`room-page ${theme}`}>
        {language === "polish" ? "Ładowanie..." : "Loading..."}
      </div>
    )
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className={`room-page ${theme}`}>
      <div
        className="board-wrapper"

        ref={boardRef}
      >
        <div
          className={[
            "board",

            "quixo-board",

            theme,

            pushing ? "pushing" : "",
          ].join(" ")}

          style={{
            gridTemplateColumns: `repeat(${SIZE},1fr)`,
          }}
        >
          {renderBoard()}
        </div>
      </div>
      
      <div className={`room-info ${theme}`}>
        <p>
          🔴
          {language === "polish" ? " Gracz 1:" : " Player 1:"}{" "}
          {room.player1?.name || "-"}
        </p>

        <p>
          🟡
          {language === "polish" ? " Gracz 2:" : " Player 2:"}{" "}
          {room.player2?.name || "-"}
        </p>

        {room.winner ? (
          <div className="winner-box">
            <p className="winner-text">
              🏆
              {language === "polish" ? " Wygrywa:" : " Winner:"}{" "}
              {getWinnerName()}
            </p>

            <button
              className="back-button"

              onClick={() => navigate("/")}
            >
              {language === "polish" ? "Powrót" : "Back"}
            </button>
          </div>
        ) : (
          <p>
            {language === "polish" ? "Tura:" : "Turn:"}{" "}
            {room.currentTurn === "player1"
              ? room.player1?.name
              : room.player2?.name}
          </p>
        )}
      </div>
    </div>
  )
}

