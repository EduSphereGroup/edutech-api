// functions/src/index.ts
import { setGlobalOptions } from "firebase-functions";
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import * as admin from 'firebase-admin';
import router from "./shared/router";

setGlobalOptions({ region: "southamerica-east1", maxInstances: 10 });

const app = express();
app.use(cors());

app.use(express.json());
app.use(router);

admin.initializeApp();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.post("/dados", (req, res) => {
  const dados = req.body;
  // TODO: salvar no Firestore
  res.status(201).send({ sucesso: true, dados });
});

export const api = functions.https.onRequest(app);
