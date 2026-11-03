import { projects } from "./projects";

describe("données des projets", () => {
  it("contient au moins un projet", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("chaque projet a un slug unique et un titre", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    projects.forEach((p) => expect(p.title).toBeTruthy());
  });
});
