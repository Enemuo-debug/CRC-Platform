import type { Request, Response } from "express";
import crypto from "crypto";
import Member from "../models/Induvidual.js";

class WebhookController {
  async handlePaystack(req: Request, res: Response) {
    try {
      const signature = req.headers["x-paystack-signature"] as string | undefined;
      const secret = process.env.PAYSTACK_SECRET_KEY;

      if (!secret) {
        console.error("Missing PAYSTACK_SECRET_KEY in env");
        return res.status(500).send("Webhook misconfigured");
      }

      const rawBody = (req as any).body as Buffer;
      const computed = crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

      if (!signature || signature !== computed) {
        console.warn("Invalid Paystack signature");
        return res.status(400).send("Invalid signature");
      }

      const payload = JSON.parse(rawBody.toString("utf8"));

      const event = payload.event;
      const data = payload.data;

      if (!event) {
        return res.status(400).send("No event");
      }

      if (event === "charge.success" || event === "payment.success" || data?.status === "success") {
        const metadata = data?.metadata || {};
        const memberId = metadata.memberId || metadata.member_id || metadata.memberID;
        const phone = metadata.phoneNumber || metadata.phone || metadata.PhoneNumber;

        let updated = null;

        if (memberId) {
          updated = await Member.findByIdAndUpdate(memberId, { Expired: false }, { new: true }).exec();
        } else if (phone) {
          updated = await Member.findOneAndUpdate({ PhoneNumber: phone }, { Expired: false }, { new: true }).exec();
        }

        if (updated) {
          console.log("Member payment confirmed, Expired set to false for:", updated._id);
          return res.status(200).send("ok");
        }

        console.warn("Webhook received but no matching member found (check metadata)");
        return res.status(404).send("Member not found");
      }

      // For other events, acknowledge
      return res.status(200).send("ignored");
    } catch (err) {
      console.error("Webhook handling error:", err);
      return res.status(500).send("Server error");
    }
  }
}

export default new WebhookController();
