import type { Request, Response } from "express";
import crypto from "crypto";
import Member from "../models/Induvidual.js";

class WebhookController {
  async handlePaystack(req: Request, res: Response) {
    try {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) {
        console.error("PAYSTACK_SECRET_KEY missing");
        return res.status(500).send("Server misconfigured");
      }

      const signature = req.headers["x-paystack-signature"] as string;

      console.log("Paystack Webhook Signature:", signature);

      if (!signature) {
        return res.status(400).send("Missing signature");
      }

      const rawBody = req.body as Buffer;

      const hash = crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

    console.log("Computed Hash: ", hash === signature ? "matches" : "does not match");

      if (hash !== signature) {
        console.warn("Invalid Paystack signature");
        return res.status(401).send("Unauthorized");
      }

      const payload = JSON.parse(rawBody.toString("utf8"));
      const { event, data } = payload;

      if (event !== "charge.success") {
        return res.status(200).send("ignored");
      }

      const metadata = data?.metadata ?? {};
      const memberId =
        metadata.memberId ||
        metadata.member_id ||
        metadata.memberID;

      const phone =
        metadata.phoneNumber ||
        metadata.phone ||
        metadata.PhoneNumber;

      let updated = null;

      if (memberId) {
        updated = await Member.findByIdAndUpdate(
          memberId,
          { Expired: false },
          { new: true }
        );
      } else if (phone) {
        updated = await Member.findOneAndUpdate(
          { PhoneNumber: phone },
          { Expired: false },
          { new: true }
        );
      }

      if (!updated) {
        console.warn("Payment confirmed but no member matched", metadata);
        return res.status(200).send("no match");
      }

      console.log("Payment confirmed for member:", updated._id);
      return res.status(200).send("ok");
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).send("Server error");
    }
  }
}

export default new WebhookController();
