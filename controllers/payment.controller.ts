import axios from "axios";
import Stripe from "stripe";
import type { Request, Response } from "express";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
//   apiVersion: "2025-12-15.clover"
// });

export class PaymentController {

  async initPaystack(req: Request, res: Response) {
    const { email, amount } = req.body;

    console.log("Initializing Paystack payment...");

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        metadata: {
          phoneNumber: req.body.phoneNumber
        },
        callback_url: "google.com" // to be replaced with actual URL
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json(response.data);
  }

//   async initStripe(req: Request, res: Response) {
//     const { amount } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/success`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: amount * 100,
//             product_data: {
//               name: "Platform Payment"
//             }
//           },
//           quantity: 1
//         }
//       ]
//     });

//     return res.json({ url: session.url });
//   }
  
}
