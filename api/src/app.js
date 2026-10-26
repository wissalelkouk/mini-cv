import express from "express";
import cors from "cors";
import helmet from "helmet";
import contactRouter from "./routes/contact.js";
import portfolioRouter from "./routes/portfolio.js";
import { notFound, errorHandler } from "./errors.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(",") }));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "devsecops-api",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
app.use("/api", portfolioRouter);
app.use("/api/contact", contactRouter);

app.use(notFound);
app.use(errorHandler);
export default app;
