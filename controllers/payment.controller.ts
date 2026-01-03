import axios from "axios";
import type { Request, Response } from "express";

class PaymentController {
    async initPaystack(req: Request, res: Response) {
        try {
            const { _id, price } = req.member!;

            console.log("Initializing Paystack payment...");

            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email: "membership@crcplatform.com",
                    amount: price * 100,
                    metadata: { 
                        memberId: _id.toString()
                    }
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
}

export default new PaymentController();
