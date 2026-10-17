import { Suspense } from "react";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <About />
      <Suspense fallback={<p>Chargement des compétences…</p>}>
        <Skills />
      </Suspense>
      <Suspense fallback={<p>Chargement des projets…</p>}>
        <Projects />
      </Suspense>
      <Experience />
      <Contact />
    </>
  );
}
