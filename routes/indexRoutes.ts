import authRoutes from "./authRoutes.js";
import { Router } from "express";
import memberRoutes from "./memberRoutes.js";
import webhookRoutes from "./webhook.routes.js";
import paymentController from "../controllers/payment.controller.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/webhook", webhookRoutes);
router.use("/member", memberRoutes);
router.get("/payment/verify/:reference", (req, res) => {
    paymentController.verifyPayment(req, res);
});

export default router;