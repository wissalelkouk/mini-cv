import { Router } from "express";
import { profile } from "../data/profile.js";
import { projects } from "../data/projects.js";
import { skills, devsecops } from "../data/skills.js";

const router = Router();
router.get("/profile", (req, res) => res.json(profile));
router.get("/projects", (req, res) => res.json(projects));
router.get("/skills", (req, res) => res.json({ skills, devsecops }));

export default router;
