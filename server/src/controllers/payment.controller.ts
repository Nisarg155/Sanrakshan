import {Request, Response} from "express";
import axios from 'axios'

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const {PAYPAL_CLIENT_ID, PAYPAL_SECRET} = process.env;
import User, {IUser} from "../models/user.model";
import {sendPremiumConfirmationEmail} from "../services/email.service";


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

        res.json({orderId: response.data.id});
    } catch (error: any) {
        console.error('Error creating PayPal order:', error.response?.data || error.message);
        res.status(500).json({error: 'Error creating order'});
    }
};

export const captureOrderHandler = async (req: Request, res: Response) => {
    try {
        const {orderID, userId} = req.body;

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
        await User.findByIdAndUpdate(userId, {isPremium: true});

        // Optional: Send confirmation email
        const user = await User.findById(userId);
        if (user) {
            const user = await User.findByIdAndUpdate(
                userId,
                {isPremium: true},
                {new: true}
            );

            console.log(`✅ User ${userId} upgraded to premium`);

            if (user?.email) {
                console.log("Called");
                
                await sendPremiumConfirmationEmail(user.email, user.displayName);
            }
        }

        res.json(response.data);
    } catch (error: any) {
        console.error('Error capturing PayPal order:', error.response?.data || error.message);
        res.status(500).json({error: 'Error capturing order'});
    }
};


export const getPremiumStatus = async (req: Request, res: Response) => {

    const user = req.user as IUser;
    if (user.isPremium) {
        res.json({status: "active"});
    } else {
        res.json({status: "inactive"});
    }
};
