import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

process.env.RATE_LIMIT_MAX = "1000";
vi.mock("../src/db.js", () => ({ default: { message: { create: vi.fn() } } }));

const { default: prisma } = await import("../src/db.js");
const { default: app } = await import("../src/app.js");

const valid = { name: "Wissal Elkouk", email: "wissal@example.com", message: "Bonjour, ceci est un message de test." };

beforeEach(() => {
  prisma.message.create.mockReset();
  prisma.message.create.mockResolvedValue({ id: 1 });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("entrées invalides -> 400 et rien n'est enregistré", () => {
  it.each([
    ["corps vide", {}],
    ["email invalide", { ...valid, email: "pas-un-email" }],
    ["nom trop court", { ...valid, name: "W" }],
    ["message trop long", { ...valid, message: "a".repeat(2001) }],
    ["champ en trop (mass assignment)", { ...valid, isAdmin: true }],
    ["type non-string", { ...valid, name: 123 }],
    ["opérateur NoSQL dans l'email", { ...valid, email: { $ne: null } }],
    ["email avec injection SQL", { ...valid, email: "a@b.com' OR '1'='1" }],
    ["tableau au lieu d'un objet", [valid]],
  ])("%s", async (_, payload) => {
    const res = await request(app).post("/api/contact").send(payload);
    expect(res.status).toBe(400);
    expect(prisma.message.create).not.toHaveBeenCalled();
  });
});

describe("injections et requêtes malformées", () => {
  it("injection SQL dans le nom : traitée comme une simple donnée (requête paramétrée)", async () => {
    const name = "Robert'); DROP TABLE contact_messages;--";
    const res = await request(app).post("/api/contact").send({ ...valid, name });
    expect(res.status).toBe(201);
    expect(prisma.message.create).toHaveBeenCalledWith({ data: { ...valid, name } });
  });

  it("JSON malformé -> 400", async () => {
    const res = await request(app).post("/api/contact").set("Content-Type", "application/json").send('{"name": ');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("JSON invalide");
  });

  it("mauvais Content-Type -> 400", async () => {
    const res = await request(app).post("/api/contact").set("Content-Type", "text/plain").send("name=a");
    expect(res.status).toBe(400);
  });

  it("corps trop gros -> 413", async () => {
    const res = await request(app).post("/api/contact").send({ ...valid, message: "a".repeat(20000) });
    expect(res.status).toBe(413);
  });

  it("erreur base de données -> 500 générique, sans fuite d'information", async () => {
    prisma.message.create.mockRejectedValue(new Error("secret db detail"));
    const res = await request(app).post("/api/contact").send(valid);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });
});
