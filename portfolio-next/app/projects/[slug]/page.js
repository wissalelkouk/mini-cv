import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <section>
      <Link href="/projects">← Tous les projets</Link>
      <h1>{project.title}</h1>
      <p>{project.details}</p>
      <ul className="chips">
        {project.technologies.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
