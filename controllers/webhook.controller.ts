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

            if (!signature) {
                return res.status(400).send("Missing signature");
            }

            const rawBody = req.body as Buffer;

            const hash = crypto
                .createHmac("sha512", secret)
                .update(rawBody)
                .digest("hex");

            console.log("Signature verification:", hash === signature ? "✓ Valid" : "✗ Invalid");

            if (hash !== signature) {
                console.warn("Invalid Paystack signature");
                return res.status(401).send("Unauthorized");
            }

            const payload = JSON.parse(rawBody.toString("utf8"));
            const { event, data } = payload;

            console.log("Webhook event:", event);

            if (event !== "charge.success") {
                return res.status(200).send("Event ignored");
            }

            const metadata = data?.metadata ?? {};
            
            // Extract phone number (checking all possible field names)
            const phone = metadata.phone || metadata.PhoneNumber || metadata.phoneNumber;

            console.log("Extracted phone from metadata:", phone);

            if (!phone) {
                console.error("No phone number in metadata:", metadata);
                return res.status(400).send("Phone number required");
            }

            // Update member by phone number
            const updated = await Member.findOneAndUpdate(
                { PhoneNumber: phone },
                { Expired: false },
                { new: true }
            );

            if (!updated) {
                console.warn("Payment confirmed but no member found with phone:", phone);
                return res.status(200).send("Member not found");
            }

            console.log("✓ Payment confirmed for member:", updated._id, "Phone:", phone);
            return res.status(200).send("Success");

        } catch (error) {
            console.error("Webhook error:", error);
            return res.status(500).send("Server error");
        }
    }
}

export default new WebhookController();
