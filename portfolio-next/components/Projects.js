import Link from "next/link";
import { getProjects } from "@/lib/api";

export default async function Projects() {
const projects = await getProjects();
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="grid">
        {projects.map((p) => (
          <article className="card" key={p.slug}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <Link href={`/projects/${p.slug}`}>Voir le projet</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
