import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../base/firebase";

export const joinRoom = async (roomCode, playerId, playerName) => {
  const roomRef = doc(db, "connect4_rooms", roomCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    await setDoc(roomRef, {
      player1: {
        id: playerId,
        name: playerName,
      },

      player2: null,

      currentTurn: "player1",

      winner: null,

      gameStarted: false,

      // 6 rzędów × 7 kolumn
      board: Array(42).fill(null),

      createdAt: Date.now(),
    });

    return {
      role: "player1",
      roomExists: true,
    };
  }

  const data = roomSnap.data();

  if (data.player1?.id === playerId) {
    return {
      role: "player1",
      roomExists: true,
    };
  }

  if (data.player2?.id === playerId) {
    return {
      role: "player2",
      roomExists: true,
    };
  }

  if (!data.player2) {
    await updateDoc(roomRef, {
      player2: {
        id: playerId,
        name: playerName,
      },

      gameStarted: true,
    });

    return {
      role: "player2",
      roomExists: true,
    };
  }

  return {
    role: "full",
    roomExists: true,
  };
};