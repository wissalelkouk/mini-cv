import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

async function remplirEtEnvoyer() {
  await userEvent.type(screen.getByLabelText(/nom/i), "Wissal");
  await userEvent.type(screen.getByLabelText(/email/i), "wissal@example.com");
  await userEvent.type(screen.getByLabelText(/message/i), "Un message de test assez long");
  await userEvent.click(screen.getByRole("button", { name: /envoyer/i }));
}

test("envoie le formulaire à /api/contact et affiche la confirmation", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "ok" }) });
  render(<ContactForm />);
  await remplirEtEnvoyer();
  expect(global.fetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  expect(await screen.findByText(/message envoyé/i)).toBeInTheDocument();
});

test("affiche l'erreur de validation renvoyée par l'API", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ message: "Données invalides", details: [{ champ: "email", message: "Invalid email address" }] }),
  });
  render(<ContactForm />);
  await remplirEtEnvoyer();
  expect(await screen.findByText(/email : invalid email address/i)).toBeInTheDocument();
});

test("affiche une erreur si le serveur est injoignable", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("réseau"));
  render(<ContactForm />);
  await remplirEtEnvoyer();
  expect(await screen.findByText(/impossible de joindre le serveur/i)).toBeInTheDocument();
});
