import Link from "next/link";
import { projects } from "@/data/projects";
export const metadata = { title: "Projets | DevSecOps Portfolio" };

export default function ProjectsPage() {
  return (
    <section>
      <h1>Projets</h1>
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
