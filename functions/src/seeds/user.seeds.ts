import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// Carregar credenciais do Firebase
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../config/firebase-adminsdk.json"), "utf-8")
);

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const uid = "0h52ZBJkLRM5X8XKh6HEWcqAdUg1";

async function clearSubcollection(path: string) {
  const snapshot = await db.collection(path).get();
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function clearCollection(collectionName: string) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

export async function seedUserAndModules() {
  try {
    console.log("🔄 Limpando dados...");

    await clearSubcollection(`progress/${uid}/items`);
    await clearSubcollection(`badges/${uid}/items`);
    await clearCollection("modules");

    console.log("📝 Inserindo dados...");

    await db.collection("users").doc(uid).set({
      xp: 250,
      level: 3,
      username: "gabriel.dev",
    });

    // Progresso
    const progressRef = db.collection(`progress/${uid}/items`);
    const progressItems = [
      { moduleId: "m1", lessonId: "l1", completed: true },
      { moduleId: "m1", lessonId: "l2", completed: true },
      { moduleId: "m2", lessonId: "l3", completed: true },
      { moduleId: "m2", lessonId: "l4", completed: true },
      { moduleId: "m3", lessonId: "l5", completed: false },
      { moduleId: "m1", completed: true },
      { moduleId: "m2", completed: false },
    ];
    for (const item of progressItems) {
      await progressRef.add(item);
    }

    // Badges
    const badgesRef = db.collection(`badges/${uid}/items`);
    const badgeItems = [
      { id: "b1", name: "Primeiros Passos", icon: "star", earned: true },
      { id: "b2", name: "Mestre do Módulo", icon: "trophy", earned: true },
      { id: "b3", name: "Novato em Design", icon: "paintbrush", earned: false },
      { id: "b4", name: "Explorador Tech", icon: "compass", earned: false },
      { id: "b5", name: "Campeão do Aprendizado", icon: "award", earned: false },
      { id: "b6", name: "Educador Mestre", icon: "graduation-cap", earned: false },
    ];
    for (const badge of badgeItems) {
      await badgesRef.add(badge);
    }

    // Módulos com grade, subject e difficulty
    const modules = [
      {
        id: "m1",
        title: "Tecnologia na Educação Infantil",
        description: "Uso lúdico da tecnologia com crianças pequenas.",
        xpReward: 200,
        orderIndex: 1,
        grade: "infantil",
        subject: "multidisciplinar",
        difficulty: "facil",
        lessons: [
          {
            id: "l1",
            moduleId: "m1",
            title: "Introdução à Tecnologia para Pequenos",
            content: "Ferramentas como tablets educativos, jogos interativos e aplicativos de desenho.",
            xpReward: 50,
            orderIndex: 1,
            practicalActivity: "Crie uma atividade de desenho digital.",
            resources: ["Toca Boca apps", "Duck Duck Moose"]
          },
          {
            id: "l2",
            moduleId: "m1",
            title: "Contação de Histórias Digital",
            content: "Use o Book Creator para criar histórias com áudio e imagens.",
            xpReward: 75,
            orderIndex: 2,
            practicalActivity: "Crie uma história digital com os alunos.",
            resources: ["Book Creator", "StoryMapJS"]
          }
        ]
      },
      {
        id: "m2",
        title: "Alfabetização Digital",
        description: "Ferramentas para apoiar a alfabetização na era digital.",
        xpReward: 250,
        orderIndex: 2,
        grade: "fundamental1",
        subject: "portugues",
        difficulty: "facil",
        lessons: [
          {
            id: "l3",
            moduleId: "m2",
            title: "Jogos de Alfabetização Online",
            content: "Wordwall e Kahoot Kids ajudam no reconhecimento de letras e palavras.",
            xpReward: 60,
            orderIndex: 1,
            practicalActivity: "Crie um jogo de palavras no Wordwall.",
            resources: ["Wordwall", "Kahoot"]
          },
          {
            id: "l4",
            moduleId: "m2",
            title: "Produção de Texto Digital",
            content: "Use o ditado por voz do Google Docs para auxiliar na escrita.",
            xpReward: 80,
            orderIndex: 2,
            practicalActivity: "Produza um texto usando o ditado por voz.",
            resources: ["Google Docs", "Storybird"]
          }
        ]
      },
      {
        id: "m3",
        title: "Matemática Lúdica Digital",
        description: "Tornar a matemática divertida com ferramentas tecnológicas.",
        xpReward: 250,
        orderIndex: 3,
        grade: "fundamental1",
        subject: "matematica",
        difficulty: "facil",
        lessons: [
          {
            id: "l5",
            moduleId: "m3",
            title: "Manipulativos Virtuais",
            content: "Blocos virtuais e ábacos digitais para ensinar operações matemáticas.",
            xpReward: 70,
            orderIndex: 1,
            practicalActivity: "Use manipulativos online para explicar adição e subtração.",
            resources: ["Math Playground", "Virtual Manipulatives"]
          }
        ]
      }
    ];

    for (const module of modules) {
      await db.collection("modules").doc(module.id).set(module);
    }

    console.log("✅ Seed completo com grade, subject e difficulty executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao rodar seed:", error);
  }
}
