import { Request, Response } from "express";
import axios from 'axios'
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
import User, { IUser } from "../models/user.model";
import { sendPremiumConfirmationEmail } from "../services/email.service";


const getAccessToken = async (): Promise<string> => {
    const response = await axios.post(
        `${PAYPAL_API}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: PAYPAL_CLIENT_ID || '',
                password: PAYPAL_SECRET || '',
            },
        }
    );

    return response.data.access_token;
};

export const createOrderHandler = async (req: Request, res: Response) => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: '100.00',
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ orderId: response.data.id });
    } catch (error: any) {
        console.error('Error creating PayPal order:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error creating order' });
    }
};

export const captureOrderHandler = async (req: Request, res: Response) => {
    try {
        const { orderID , userId } = req.body;

        const accessToken = await getAccessToken();

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Optional: Update user's premium status
        await User.findByIdAndUpdate(userId, { isPremium: true });

        // Optional: Send confirmation email
        const user = await User.findById(userId);
        if (user) {
            const user = await User.findByIdAndUpdate(
                userId,
                { isPremium: true },
                { new: true }
            );

            console.log(`✅ User ${userId} upgraded to premium`);

            if (user?.email) {
                await sendPremiumConfirmationEmail(user.email, user.displayName);
            }
        }

        res.json(response.data);
    } catch (error: any) {
        console.error('Error capturing PayPal order:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error capturing order' });
    }
};




// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: "2025-02-24.acacia",
// });
//
// export const createCheckoutSession = async (req: Request, res: Response) => {
//     const user = req.user as any;
//
//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: "Lifetime Subscription",
//                         },
//                         unit_amount: 1000, // $10
//                     },
//                     quantity: 1,
//                 },
//             ],
//             customer_email: user.email,
//             mode: "payment",
//             success_url: `${process.env.CLIENT_URL}/payment-success`,
//             cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
//             client_reference_id: user._id.toString(),
//         });
//
//         res.json({ sessionId: session.id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create charge" });
//     }
// };
//
// export const handleWebhook = async (req: Request, res: Response) => {
//     const sig = req.headers["stripe-signature"] as string;
//
//     let event: Stripe.Event;
//
//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         );
//     } catch (err: any) {
//         console.error("Webhook signature verification failed:", err.message);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }
//
//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const userId = session.client_reference_id;
//
//         if (userId) {
//             const user = await User.findByIdAndUpdate(
//                 userId,
//                 { isPremium: true },
//                 { new: true }
//             );
//             console.log(`User ${userId} upgraded to premium`);
//
//             if (user && user.email) {
//                 await sendPremiumConfirmationEmail(user.email, user.displayName);
//             }
//         }
//     }
//
//     res.json({ received: true });
// };

export const getPremiumStatus = async (req: Request, res: Response) => {

    const user = req.user as IUser;
    if (user.isPremium) {
        res.json({ status: "active" });
    } else {
        res.json({ status: "inactive" });
    }
};
