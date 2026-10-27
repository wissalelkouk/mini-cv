import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

async function remplirEtEnvoyer() {
  const user = userEvent.setup({ delay: null });
  await user.click(screen.getByLabelText(/nom/i));
  await user.paste("Wissal");
  await user.click(screen.getByLabelText(/email/i));
  await user.paste("wissal@example.com");
  await user.click(screen.getByLabelText(/message/i));
  await user.paste("Un message de test assez long");
  await user.click(screen.getByRole("button", { name: /envoyer/i }));
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
