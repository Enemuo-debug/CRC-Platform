import axios from "axios";
import type { Request, Response } from "express";
import Member from "../models/Induvidual.js";

class PaymentController {
    async initPaystack(req: Request, res: Response): Promise<Response> {
        try {
            const { _id, price } = req.member!;

            console.log("Initializing Paystack payment...");

            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email: `membership_${_id}@crcplatform.com`,
                    amount: price * 100,
                    metadata: { 
                        memberId: _id.toString()
                    },
                    callback_url: `${process.env.FRONTEND_URL}/verify-payment`
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.json(response.data);

        } catch (error: any) {
            console.error("Paystack error:", error.response?.data || error.message);
            return res.status(500).json({
                message: "Paystack initialization failed",
                error: error.response?.data
            });
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { reference } = req.params;

            if (!reference) {
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Payment reference is required",
                    data: null
                });
            }

            console.log("Verifying payment reference:", reference);

            // Call Paystack verification endpoint
            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    }
                }
            );

            const paymentData = response.data.data;

            console.log("Paystack verification response:", paymentData);

            // Check if payment was successful
            if (paymentData.status !== "success") {
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Payment was not successful",
                    data: paymentData
                });
            }

            // Extract metadata
            const metadata = paymentData.metadata || {};
            const phone = metadata.phone || metadata.PhoneNumber || metadata.phoneNumber;
            const amount = paymentData.amount / 100; // Convert from kobo to naira

            console.log("Payment verified successfully:", {
                reference: paymentData.reference,
                amount,
                phone,
                status: paymentData.status
            });

            // Update member status if phone exists
            if (phone) {
                const updated = await Member.findOneAndUpdate(
                    { PhoneNumber: phone },
                    { Expired: false },
                    { new: true }
                );

                if (updated) {
                    console.log("✅ Member activated:", updated._id);
                } else {
                    console.warn("⚠️ Member not found with phone:", phone);
                }
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Payment verified successfully",
                data: {
                    reference: paymentData.reference,
                    amount,
                    currency: paymentData.currency,
                    status: paymentData.status,
                    paidAt: paymentData.paid_at,
                    channel: paymentData.channel,
                    customer: {
                        email: paymentData.customer.email,
                        phone: phone
                    }
                }
            });

        } catch (error: any) {
            console.error("Payment verification error:", error.response?.data || error.message);
            
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Payment verification failed",
                data: error.response?.data || error.message
            });
        }
    }
}

export default new PaymentController();
