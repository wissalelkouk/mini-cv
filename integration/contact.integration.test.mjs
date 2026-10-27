import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const DB_USER = process.env.POSTGRES_USER || "portfolio";
const DB_NAME = process.env.POSTGRES_DB || "portfolio";

const post = (body) =>
  fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const count = (email) =>
  execSync(
    `docker compose exec -T db psql -U ${DB_USER} -d ${DB_NAME} -tAc "SELECT count(*) FROM contact_messages WHERE email='${email}'"`,
  ).toString().trim();

test("le front répond", async () => {
  assert.equal((await fetch(BASE)).status, 200);
});

test("front -> API -> PostgreSQL : un message valide est enregistré", async () => {
  const email = `it-${Date.now()}@example.com`;
  const res = await post({ name: "Test Integration", email, message: "Message de test d'intégration" });
  assert.equal(res.status, 201);
  assert.equal(count(email), "1");
});

test("un message invalide est refusé et non enregistré", async () => {
  const email = `bad-${Date.now()}@example.com`;
  const res = await post({ name: "x", email, message: "court" });
  assert.equal(res.status, 400);
  assert.equal(count(email), "0");
});

test("une injection SQL est stockée comme simple texte, la table survit", async () => {
  const email = `inj-${Date.now()}@example.com`;
  const res = await post({ name: "Robert'); DROP TABLE contact_messages;--", email, message: "Test injection SQL" });
  assert.equal(res.status, 201);
  assert.equal(count(email), "1");
});
