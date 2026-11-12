const express = require("express");
const multer = require("multer");
const crypto = require("node:crypto");
const path = require("node:path");
const rateLimit = require("express-rate-limit");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

// Les identifiants viennent de AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (variables d'environnement)
const config = {
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT_URL || "http://localhost:4566",
  forcePathStyle: true,
};
const s3 = new S3Client(config);
const sqs = new SQSClient(config);

const BUCKET = process.env.BUCKET || "mini-cv-bucket";
const QUEUE_URL = process.env.QUEUE_URL || "http://localhost:4566/000000000000/notifications";
const EXTENSIONS_OK = new Set([".txt", ".pdf", ".png", ".jpg", ".jpeg"]);

// Validation d'email sans expression régulière complexe
function emailValide(valeur) {
  if (valeur.length > 254 || /\s/.test(valeur)) return false;
  const arobase = valeur.indexOf("@");
  if (arobase < 1 || arobase !== valeur.lastIndexOf("@")) return false;
  const domaine = valeur.slice(arobase + 1);
  return domaine.includes(".") && !domaine.startsWith(".") && !domaine.endsWith(".");
}

const app = express();
app.use(express.json({ limit: "100kb" }));

const limiteur = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// En mémoire : aucune écriture sur le disque, donc pas de chemin contrôlé par l'utilisateur
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/contact", limiteur, upload.single("piece"), async (req, res) => {
  const { nom, email, message } = req.body;
  if (![nom, email, message].every((v) => typeof v === "string" && v.length > 0 && v.length <= 1000)) {
    return res.status(400).json({ status: "ERREUR", message: "nom, email et message sont obligatoires" });
  }
  if (!emailValide(email)) {
    return res.status(400).json({ status: "ERREUR", message: "email invalide" });
  }

  try {
    let cle = null;
    if (req.file) {
      const extension = path.extname(req.file.originalname).toLowerCase();
      if (!EXTENSIONS_OK.has(extension)) {
        return res.status(400).json({ status: "ERREUR", message: "type de fichier non autorisé" });
      }
      // Clé générée par le serveur : le nom envoyé par le client n'est jamais utilisé
      cle = `pieces/${crypto.randomUUID()}${extension}`;
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: cle, Body: req.file.buffer }));
    }

    await sqs.send(new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({ nom, email, message, pieceJointe: cle }),
    }));

    res.json({ status: "OK", message: "Contact et pièce jointe traités" });
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ status: "ERREUR", message: "erreur serveur" });
  }
});

module.exports = app;
if (require.main === module) app.listen(3000, () => console.log("API sur :3000"));
