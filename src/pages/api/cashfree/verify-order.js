import axios from 'axios';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { order_id } = req.body;
        if (!order_id) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const isProd = process.env.NODE_ENV === 'production';
        const baseUrl = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
        const appId = process.env.CASHFREE_APP_ID || 'TEST_APP_ID';
        const secretKey = process.env.CASHFREE_SECRET_KEY || 'TEST_SECRET_KEY';

        const response = await axios.get(`${baseUrl}/orders/${order_id}`, {
            headers: {
                'x-api-version': '2023-08-01',
                'x-client-id': appId,
                'x-client-secret': secretKey,
                'Accept': 'application/json'
            }
        });

        const orderData = response.data;

        // If payment is successful, update transaction and subscription
        if (orderData.order_status === 'PAID') {
            const transaction = await prisma.paymentTransaction.findUnique({
                where: { orderId: order_id }
            });
            
            if (transaction && transaction.status !== 'PAID') {
                const startDate = new Date();
                const endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

                // Find the user's business profile
                const businessProfile = await prisma.businessProfile.findUnique({
                    where: { userId: transaction.userId }
                });

                let subscriptionId = null;

                if (businessProfile) {
                    // Upsert subscription
                    const subscription = await prisma.subscription.upsert({
                        where: { businessProfileId: businessProfile.id },
                        update: {
                            plan: transaction.planType,
                            startDate: startDate,
                            endDate: endDate,
                            isActive: true
                        },
                        create: {
                            businessProfileId: businessProfile.id,
                            plan: transaction.planType,
                            startDate: startDate,
                            endDate: endDate,
                            isActive: true
                        }
                    });
                    subscriptionId = subscription.id;
                }

                // Update transaction
                await prisma.paymentTransaction.update({
                    where: { orderId: order_id },
                    data: {
                        status: 'PAID',
                        startDate: startDate,
                        endDate: endDate,
                        subscriptionId: subscriptionId
                    }
                });
            }
        } else if (orderData.order_status === 'FAILED' || orderData.order_status === 'CANCELLED') {
            await prisma.paymentTransaction.update({
                where: { orderId: order_id },
                data: {
                    status: orderData.order_status
                }
            }).catch(e => console.error("Error updating failed transaction", e));
        }

        return res.status(200).json(orderData);
    } catch (error) {
        console.error('Cashfree Verify Order Error:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Failed to verify order',
            error: error.response?.data || error.message
        });
    }
}
