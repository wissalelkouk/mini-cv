const bouton = document.getElementById("theme");

bouton.addEventListener("click", () => {
  document.body.classList.toggle("sombre");
  bouton.textContent = document.body.classList.contains("sombre")
    ? "Mode clair"
    : "Mode sombre";
});
