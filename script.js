const racine = document.documentElement;

// Thème clair / sombre mémorisé dans le navigateur
try {
  const saved = localStorage.getItem("theme");
  if (saved) racine.dataset.theme = saved;
} catch (e) { /* stockage indisponible */ }

document.getElementById("theme").addEventListener("click", () => {
  const next = racine.dataset.theme === "light" ? "dark" : "light";
  racine.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) { /* ignoré */ }
});

// Formulaire de contact : ouvre le client mail (aucune donnée envoyée à un serveur)
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nom = document.getElementById("nom").value.trim();
  const msg = document.getElementById("msg").value.trim();
  const sujet = encodeURIComponent("Contact portfolio : " + nom);
  window.location.href = "mailto:wissalelkouk@gmail.com?subject=" + sujet + "&body=" + encodeURIComponent(msg);
});

document.getElementById("annee").textContent = new Date().getFullYear();
