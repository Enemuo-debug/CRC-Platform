import type { Request, Response } from "express";
import crypto from "crypto";
import Member from "../models/Induvidual.js";

class WebhookController {
    async handlePaystack(req: Request, res: Response) {
        try {
            console.log("Received Paystack webhook");
            const secret = process.env.PAYSTACK_SECRET_KEY;
            
            // Debug: Check secret key
            console.log("Secret key exists?", !!secret);
            console.log("Secret key prefix:", secret?.substring(0, 7));
            
            if (!secret) {
                console.error("PAYSTACK_SECRET_KEY missing");
                return res.status(500).send("Server misconfigured");
            }

            const signature = req.headers["x-paystack-signature"] as string;
            
            console.log("Received signature:", signature);
            
            if (!signature) {
                console.log("❌ No signature in headers");
                return res.status(400).send("Missing signature");
            }

            // Debug: Check body type
            const rawBody = req.body as Buffer;
            console.log("Body is Buffer?", Buffer.isBuffer(rawBody));
            console.log("Body length:", rawBody?.length);

            // Handle both Buffer and already-parsed objects
            let bodyString: string;
            if (Buffer.isBuffer(rawBody)) {
                bodyString = rawBody.toString('utf8');
            } else {
                // If body was already parsed, stringify it
                bodyString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
            }

            console.log("Body preview:", bodyString.substring(0, 100));

            // Compute hash
            const hash = crypto
                .createHmac("sha512", secret)
                .update(bodyString, 'utf8')
                .digest("hex");

            console.log("Computed hash:", hash.substring(0, 20) + "...");
            console.log("Expected sig:", signature.substring(0, 20) + "...");
            console.log("Signature verification:", hash === signature ? "✓ Valid" : "✗ Invalid");

            if (hash !== signature) {
                console.warn("❌ Invalid Paystack signature");
                console.warn("This usually means:");
                console.warn("1. Wrong PAYSTACK_SECRET_KEY in .env");
                console.warn("2. Body was parsed before reaching webhook");
                console.warn("3. Webhook URL mismatch in Paystack dashboard");
                return res.status(401).send("Unauthorized");
            }

            console.log("✓ Signature verified successfully");

            // Parse payload
            const payload = typeof rawBody === 'string' 
                ? JSON.parse(rawBody) 
                : Buffer.isBuffer(rawBody)
                ? JSON.parse(rawBody.toString("utf8"))
                : rawBody;

            const { event, data } = payload;

            console.log("Webhook event:", event);

            if (event !== "charge.success") {
                console.log("Event ignored:", event);
                return res.status(200).send("Event ignored");
            }

            const metadata = data?.metadata ?? {};
            
            console.log("Full metadata:", JSON.stringify(metadata, null, 2));
            
            // Extract memberId number (checking all possible field names)
            const memberId = metadata.memberId;

            console.log("Extracted memberId from metadata:", memberId);

            if (!memberId) {
                console.error("❌ No Id number in metadata:", metadata);
                return res.status(400).send("memberId number required");
            }

            // Update member by memberId number
            console.log("Searching for member with memberId:", memberId);
            
            const updated = await Member.findOneAndUpdate(
                { _id: memberId },
                { Expired: false },
                { new: true }
            );

            if (!updated) {
                console.warn("⚠️ Payment confirmed but no member found with memberId:", memberId);
                console.warn("Check if memberId format matches your database");
                return res.status(200).send("Member not found");
            }

            console.log("✅ Payment confirmed for member:", updated._id, "memberId:", memberId);
            return res.status(200).send("Success");

        } catch (error: any) {
            console.error("❌ Webhook error:", error.message);
            console.error("Stack trace:", error.stack);
            return res.status(500).send("Server error");
        }
    }
}

export default new WebhookController();