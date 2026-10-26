import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "../schemas.js";
import { HttpError } from "../errors.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Trop de requêtes, réessayez plus tard." },
});

router.post("/", limiter, async (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => ({ champ: i.path.join("."), message: i.message }));
    return next(new HttpError(400, "Données invalides", details));
  }
  try {
    // Prisma sera branché à l'étape PostgreSQL ; pour l'instant on simule l'enregistrement
    res.status(201).json({ status: "ok", id: 1 });
  } catch (err) {
    next(err);
  }
});

export default router;
