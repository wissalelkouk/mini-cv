import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="hero">
      <Image src="/photo.jpg" alt="Photo de Wissal Elkouk" width={160} height={160} className="photo" priority />
      <div>
        <p className="tag">DevSecOps Portfolio</p>
        <h1>Wissal Elkouk</h1>
        <p className="role">Étudiante en master DevOps Cloud</p>
        <p>Passionnée par l'automatisation, la sécurité des systèmes et les infrastructures cloud.</p>
      </div>
    </section>
  );
}
