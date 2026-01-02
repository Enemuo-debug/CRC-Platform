import express, { Router } from "express";
import WebhookController from "../controllers/webhook.controller.js";

const router: Router = Router();

router.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("Received Paystack webhook:", req.body);
    WebhookController.handlePaystack(req, res);
  }
);

export default router;
