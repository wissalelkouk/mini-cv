import express from "express";
import cors from "cors";
import helmet from "helmet";
import { profile } from "./data/profile.js";
import { projects } from "./data/projects.js";
import { skills, devsecops } from "./data/skills.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "devsecops-api",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/profile", (req, res) => res.json(profile));
app.get("/api/projects", (req, res) => res.json(projects));
app.get("/api/skills", (req, res) => res.json({ skills, devsecops }));

app.use((req, res) => res.status(404).json({ error: "Route introuvable" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API demarree sur le port ${PORT}`);
});
