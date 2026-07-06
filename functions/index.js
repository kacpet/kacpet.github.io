const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

setGlobalOptions({
  region: "europe-central2",
  maxInstances: 10,
});

const db = admin.firestore();

exports.deleteExpiredRooms = onSchedule("every 1 minutes", async () => {
  const now = Date.now();

  const snapshot = await db.collection("connect4_rooms").get();

  const batch = db.batch();

  snapshot.forEach((doc) => {
    const data = doc.data();

    const createdAt = data.createdAt || 0;

    const winnerAt = data.winnerAt || null;

    const oneHourPassed = now - createdAt >= 60 * 60 * 1000;

    const thirtySecondsPassed =
      winnerAt && now - winnerAt >= 30 * 1000;

    if (oneHourPassed || thirtySecondsPassed) {
      batch.delete(doc.ref);
    }
  });

  await batch.commit();

  console.log("Usunięto wygasłe pokoje.");
});