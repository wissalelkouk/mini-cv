import { connection } from "next/server";

// Appelé côté serveur : API_URL n'est jamais envoyée au navigateur.
const API_URL = process.env.API_URL || "http://localhost:4000";

async function get(path) {
  // Les données sont lues à chaque requête, pas pendant le build.
  await connection();
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} : erreur ${res.status}`);
  }
  return res.json();
}

export const getProjects = () => get("/api/projects");
export const getSkills = () => get("/api/skills");
