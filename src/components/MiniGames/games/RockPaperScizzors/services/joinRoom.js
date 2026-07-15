import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

import { db } from "../../../base/firebase";

// =========================
// 🧹 CLEANUP MARTWYCH POKOI
// =========================
const cleanupRooms = async () => {
    const snapshot = await getDocs(collection(db, "rooms"));

    const now = Date.now();
    const deletes = [];

    snapshot.forEach((d) => {
        const data = d.data();

        const createdAt = Number(data.createdAt ?? 0);
        const winnerAt = data.winnerAt ? Number(data.winnerAt) : null;
        const hasWinner = !!data.winner;

        // ⏳ stare pokoje (10 min)
        const expiredByTime = now - createdAt >= 10 * 60 * 1000;

        // 🏁 po wygranej (10s)
        const expiredByWin = hasWinner && winnerAt && now - winnerAt >= 10 * 1000;

        if (expiredByTime || expiredByWin) {
            deletes.push(deleteDoc(doc(db, "rooms", d.id)));
        }
    });

    await Promise.all(deletes);
};

// =========================
// 🚀 JOIN ROOM
// =========================
export const joinRoom = async (roomCode, playerId, playerName) => {
    // 🧹 cleanup przed join
    await cleanupRooms();

    const roomRef = doc(db, "rooms", roomCode);
    const roomSnap = await getDoc(roomRef);

    const now = Date.now();

    if (!roomSnap.exists()) {
        await setDoc(roomRef, {
            player1: {
                id: playerId,
                name: playerName,
            },
            player2: null,

            ready1: false,
            ready2: false,

            createdAt: now,
            winner: null,
            winnerAt: null,
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
                name: playerName,
            },
        });

        return { role: "player2", roomExists: true };
    }

    return { role: "full", roomExists: true };
};
