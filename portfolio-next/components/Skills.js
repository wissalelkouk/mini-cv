import { getSkills } from "@/lib/api";
export default async function Skills() {
const { skills, devsecops } = await getSkills();
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="grid">
        {skills.map((s) => (
          <article className="card" key={s.category}>
            <h3>{s.category}</h3>
            <ul className="chips">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <h2>DevSecOps Skills</h2>
      <div className="grid">
        {devsecops.map((d) => (
          <article className="card" key={d.name}>
            <h3>{d.name}</h3>
            <span className="badge">{d.used ? "Utilisé dans le projet" : "En apprentissage"}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
