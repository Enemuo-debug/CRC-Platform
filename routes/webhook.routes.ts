import express, { Router } from "express";
import WebhookController from "../controllers/webhook.controller.js";

const router: Router = Router();

// Use raw body for webhook so signature verification works
router.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  (req, res) => {
    WebhookController.handlePaystack(req, res);
  }
);

export default router;
