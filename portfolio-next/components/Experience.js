import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <ol className="timeline">
        {experience.map((e) => (
          <li key={e.period}><strong>{e.period}</strong><span>{e.title}</span></li>
        ))}
      </ol>
    </section>
  );
}
