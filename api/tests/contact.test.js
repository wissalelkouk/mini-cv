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
});

describe("routes de l'API", () => {
  it("GET /api/health -> 200 avec les headers Helmet", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("GET /api/projects -> 200 et un tableau", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/contact valide -> 201", async () => {
    const res = await request(app).post("/api/contact").send(valid);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ status: "ok", id: 1 });
    expect(prisma.message.create).toHaveBeenCalledWith({ data: valid });
  });

  it("route inconnue -> 404 JSON", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
  });
});
