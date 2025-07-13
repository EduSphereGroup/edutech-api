import * as admin from "firebase-admin";

class UserService {
  async getUserStats(uid: string) {
    const db = admin.firestore();

    // 1. Buscar dados do usuário (XP e Level)
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // 2. Buscar progresso
    const progressSnapshot = await db.collection(`progress/${uid}/items`).get();
    const progress = progressSnapshot.docs.map((doc) => doc.data());

    const completedLessons = progress.filter(
      (p) => p.completed && p.lessonId
    ).length;
    const completedModules = progress.filter(
      (p) => p.completed && p.moduleId && !p.lessonId
    ).length;

    // 3. Buscar badges
    const badgeSnapshot = await db.collection(`badges/${uid}/items`).get();
    const badges = badgeSnapshot.docs.map((doc) => doc.data());
    const earnedBadges = badges.filter((b) => b.earned).length;

    return {
      xp: userData?.xp || 0,
      level: userData?.level || 1,
      completedLessons,
      completedModules,
      earnedBadges,
    };
  }

  async getProgress(uid: string) {
    const db = admin.firestore();
    const progressSnapshot = await db
      .collection("progress")
      .doc(uid)
      .collection("items")
      .get();

    return progressSnapshot.docs.map((doc) => doc.data());
  }

  async getBadges(uid: string) {
    const db = admin.firestore();
    const badgesSnapshot = await db
      .collection("badges")
      .doc(uid)
      .collection("items")
      .get();

    return badgesSnapshot.docs.map((doc) => doc.data());
  }

  async getModules(grade: string, subject: string, difficulty: string) {
    const db = admin.firestore();

    const snapshot = await db
      .collection("modules")
      .where("grade", "==", grade)
      .where("subject", "==", subject)
      .where("difficulty", "==", difficulty)
      .orderBy("orderIndex")
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async getModuleById(id: string) {
    const db = admin.firestore();
    const doc = await db.collection("modules").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  }

  async completeLesson(uid: string, moduleId: string, lessonId: string) {
    const db = admin.firestore();

    const progressRef = db.collection(`progress/${uid}/items`);

    // Verificar se já existe o registro da aula
    const snapshot = await progressRef
      .where("moduleId", "==", moduleId)
      .where("lessonId", "==", lessonId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      // Aula já existe, atualizar o campo completed
      const doc = snapshot.docs[0];
      await doc.ref.update({ completed: true });
    } else {
      // Criar novo registro de progresso
      await progressRef.add({
        moduleId,
        lessonId,
        completed: true,
      });
    }
  }
}

export const userService = new UserService();
