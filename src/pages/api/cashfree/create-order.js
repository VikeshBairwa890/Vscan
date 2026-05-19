import axios from 'axios';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { amount = 3499 } = req.body;

        const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const isProd = process.env.NODE_ENV === 'production';
        const baseUrl = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
        const appId = process.env.CASHFREE_APP_ID || 'TEST_APP_ID';
        const secretKey = process.env.CASHFREE_SECRET_KEY || 'TEST_SECRET_KEY';

        const customerEmail = "vikeshbairwa890@gmail.com";
        const customerPhone = "7374852009";
        const customerName = "vikesh kumar bairwa";

        // Find or create user based on email
        let user = await prisma.user.findUnique({
            where: { email: customerEmail }
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: customerEmail,
                    name: customerName,
                    password: "temp_password_generate_something_secure", 
                }
            });
        }
        
        // Ensure BusinessProfile exists for this user
        let businessProfile = await prisma.businessProfile.findUnique({
            where: { userId: user.id }
        });
        
        if (!businessProfile) {
            businessProfile = await prisma.businessProfile.create({
                data: {
                    userId: user.id,
                    businessName: `${customerName}'s Business`,
                    contactNumber: customerPhone,
                    email: customerEmail
                }
            });
        }

        // Construct payload for Cashfree
        const payload = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: user.id,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/billing?order_id={order_id}`
            }
        };

        const response = await axios.post(`${baseUrl}/orders`, payload, {
            headers: {
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Create PaymentTransaction in PENDING state
        await prisma.paymentTransaction.create({
            data: {
                userId: user.id,
                orderId: orderId,
                paymentSessionId: response.data.payment_session_id,
                amount: parseFloat(amount),
                status: 'PENDING',
                planType: 'PREMIUM'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Cashfree Create Order Error:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Failed to create order',
            error: error.response?.data || error.message
        });
    }
}
