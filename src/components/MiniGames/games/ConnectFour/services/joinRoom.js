import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

import { db } from "../../../base/firebase";

// =========================
// 🧹 CLEANUP MARTWYCH POKOI
// =========================
const cleanupRooms = async () => {
    const snapshot = await getDocs(collection(db, "connect4_rooms"));

    const now = Date.now();
    const deletes = [];

    snapshot.forEach((d) => {
        const data = d.data();

        const createdAt = Number(data.createdAt ?? 0);
        const winnerAt = data.winnerAt ? Number(data.winnerAt) : null;
        const hasWinner = !!data.winner;

        // =========================
        // ⏳ STARE POKOJE (1h)
        // =========================
        const expiredByTime = now - createdAt >= 10 * 60 * 1000;

        const expiredByWin = hasWinner && winnerAt && now - winnerAt >= 10 * 1000;

        // =========================
        // 🧨 USUWANIE
        // =========================
        if (expiredByTime || expiredByWin) {
            deletes.push(deleteDoc(doc(db, "connect4_rooms", d.id)));
        }
    });

    await Promise.all(deletes);
};

// =========================
// 🚀 JOIN ROOM
// =========================
export const joinRoom = async (roomCode, playerId, playerName) => {
    // 🧹 zawsze najpierw sprzątanie
    await cleanupRooms();

    const roomRef = doc(db, "connect4_rooms", roomCode);
    const roomSnap = await getDoc(roomRef);

    const now = Date.now();

    // =========================
    // 1. POKÓJ NIE ISTNIEJE
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
            board: Array(42).fill(null),

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
    // 2. PLAYER 1 REJOIN
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
    // 3. PLAYER 2 REJOIN
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
    // 4. JOIN AS PLAYER 2
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
