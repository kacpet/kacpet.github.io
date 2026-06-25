import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../base/firebase";

export const joinRoom = async (roomCode, playerId, playerName) => {
  const roomRef = doc(db, "rooms", roomCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    await setDoc(roomRef, {
      player1: {
        id: playerId,
        name: playerName
      },
      player2: null,
      ready1: false,
      ready2: false,
      createdAt: Date.now()
    });

    return { role: "player1", roomExists: true };
  }

  const data = roomSnap.data();

  if (data.player1?.id === playerId) {
    return { role: "player1", roomExists: true };
  }

  if (data.player2?.id === playerId) {
    return { role: "player2", roomExists: true };
  }

  if (!data.player2) {
    await updateDoc(roomRef, {
      player2: {
        id: playerId,
        name: playerName
      }
    });

    return { role: "player2", roomExists: true };
  }

  return { role: "full", roomExists: true };
};