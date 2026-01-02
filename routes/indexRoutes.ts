import authRoutes from "./authRoutes.js";
import { Router } from "express";
import payRoutes from "./payment.routes.js";
import memberRoutes from "./memberRoutes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/payment", payRoutes);
router.use("/member", memberRoutes);

export default router;