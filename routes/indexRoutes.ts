import authRoutes from "./authRoutes.js";
import { Router } from "express";
import memberRoutes from "./memberRoutes.js";
import webhookRoutes from "./webhook.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/webhook", webhookRoutes);
router.use("/member", memberRoutes);

export default router;