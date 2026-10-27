import { it, expect, vi } from "vitest";
import request from "supertest";

process.env.RATE_LIMIT_MAX = "3";
vi.mock("../src/db.js", () => ({ default: { message: { create: vi.fn().mockResolvedValue({ id: 1 }) } } }));

const { default: app } = await import("../src/app.js");

it("la 4e requête reçoit 429", async () => {
  const body = { name: "Wissal", email: "w@example.com", message: "Un message de test assez long" };
  for (let i = 0; i < 3; i++) {
    expect((await request(app).post("/api/contact").send(body)).status).toBe(201);
  }
  const res = await request(app).post("/api/contact").send(body);
  expect(res.status).toBe(429);
  expect(res.body.status).toBe("error");
});
