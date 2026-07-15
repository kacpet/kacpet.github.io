import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

import { db } from "../../../base/firebase";

// =========================
// 🧹 CLEANUP QUIXO ROOMS
// =========================
const cleanupRooms = async () => {
    const snapshot = await getDocs(collection(db, "quixo_rooms"));

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
            deletes.push(deleteDoc(doc(db, "quixo_rooms", d.id)));
        }
    });

    await Promise.all(deletes);
};

// =========================
// 🚀 JOIN ROOM (QUIXO)
// =========================
export const joinRoom = async (roomCode, playerId, playerName) => {
    // 🧹 cleanup przed join
    await cleanupRooms();

    const roomRef = doc(db, "quixo_rooms", roomCode);
    const roomSnap = await getDoc(roomRef);

    const now = Date.now();

    // =========================
    // 1. CREATE ROOM
    // =========================
    if (!roomSnap.exists()) {
        await setDoc(roomRef, {
            player1: {
                id: playerId,
                name: playerName,
            },
            player2: null,

            currentTurn: "player1",
            winner: null,
            winnerAt: null,

            gameStarted: false,

            // 5x5 = 25 pól
            board: Array(25).fill(null),

            createdAt: now,
            lastActivity: now,
        });

        return {
            role: "player1",
            roomExists: true,
        };
    }

    const data = roomSnap.data();

    // =========================
    // 2. REJOIN PLAYER 1
    // =========================
    if (data.player1?.id === playerId) {
        await updateDoc(roomRef, {
            lastActivity: now,
        });

        return {
            role: "player1",
            roomExists: true,
        };
    }

    // =========================
    // 3. REJOIN PLAYER 2
    // =========================
    if (data.player2?.id === playerId) {
        await updateDoc(roomRef, {
            lastActivity: now,
        });

        return {
            role: "player2",
            roomExists: true,
        };
    }

    // =========================
    // 4. JOIN PLAYER 2
    // =========================
    if (!data.player2) {
        await updateDoc(roomRef, {
            player2: {
                id: playerId,
                name: playerName,
            },

            gameStarted: true,
            lastActivity: now,
        });

        return {
            role: "player2",
            roomExists: true,
        };
    }

    // =========================
    // 5. FULL ROOM
    // =========================
    return {
        role: "full",
        roomExists: true,
    };
};
