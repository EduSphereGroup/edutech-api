import { seedUserAndModules } from "./seeds/user.seeds";

seedUserAndModules()
  .then(() => {
    console.log("🌱 Seed finalizado!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erro ao rodar seed:", err);
    process.exit(1);
  });
