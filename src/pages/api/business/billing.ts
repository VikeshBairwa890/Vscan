import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@/generated/prisma/client";
import ActivityLogs from "@/services/ActivityLogs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;

    if (method !== "GET" && method !== "POST") {
        return res.status(200).json({ success: false, message: "Method Not Allowed" });
    }

    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Unauthorized: Missing user ID." });
    }
    try {
        // Find user's business profile
        let businessProfile = await prisma.businessProfile.findUnique({
            where: { userId: userId },
            include: {
                subscription: true
            }
        });

        // If business profile doesn't exist, retrieve user and create profile
        if (!businessProfile) {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            businessProfile = await prisma.businessProfile.create({
                data: {
                    userId: userId,
                    businessName: user.name ? `${user.name}'s Business` : "My Business",
                    email: user.email
                },
                include: {
                    subscription: true
                }
            });
        }

        if (method === "GET") {
            const subscription = businessProfile.subscription;

            // Retrieve all payment transactions for this user
            const transactions = await prisma.paymentTransaction.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' }
            });

            if (!subscription) {
                return res.status(200).json({
                    success: true,
                    subscription: {
                        plan: "FREE",
                        isActive: false,
                        isExpired: false,
                        remainingDays: 0,
                        startDate: null,
                        endDate: null
                    },
                    transactions: transactions
                });
            }

            let remainingDays = 0;
            let isExpired = false;
            if (subscription.endDate) {
                const end = new Date(subscription.endDate);
                const now = new Date();
                const diffTime = end.getTime() - now.getTime();
                remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (remainingDays < 0) {
                    remainingDays = 0;
                    isExpired = true;
                }
            }

            // Expiry/active state calculation
            const isActive = subscription.isActive && !isExpired;

            return res.status(200).json({
                success: true,
                subscription: {
                    id: subscription.id,
                    businessProfileId: subscription.businessProfileId,
                    plan: subscription.plan,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    isActive: isActive,
                    isExpired: isExpired,
                    remainingDays: remainingDays,
                    createdAt: subscription.createdAt,
                    updatedAt: subscription.updatedAt
                },
                transactions: transactions
            });
        }

        if (method === "POST") {
            const { plan, startDate, endDate, isActive, orderId } = req.body;

            if (!plan || !Object.values(PlanType).includes(plan as PlanType)) {
                return res.status(200).json({
                    success: false,
                    message: `Invalid or missing plan type. Supported plan types: ${Object.values(PlanType).join(", ")}`
                });
            }

            const subStartDate = startDate ? new Date(startDate) : new Date();
            const subEndDate = endDate ? new Date(endDate) : null;
            const subIsActive = isActive !== undefined ? Boolean(isActive) : true;

            // Save or update subscription
            const subscription = await prisma.subscription.upsert({
                where: { businessProfileId: businessProfile.id },
                update: {
                    plan: plan as PlanType,
                    startDate: subStartDate,
                    endDate: subEndDate,
                    isActive: subIsActive
                },
                create: {
                    businessProfileId: businessProfile.id,
                    plan: plan as PlanType,
                    startDate: subStartDate,
                    endDate: subEndDate,
                    isActive: subIsActive
                }
            });

            // If orderId is provided, link transaction to subscription and mark as PAID
            if (orderId) {
                const existingTxn = await prisma.paymentTransaction.findUnique({
                    where: { orderId: orderId }
                });

                if (existingTxn) {
                    await prisma.paymentTransaction.update({
                        where: { orderId: orderId },
                        data: {
                            subscriptionId: subscription.id,
                            status: 'PAID',
                            planType: plan as PlanType,
                            startDate: subStartDate,
                            endDate: subEndDate
                        }
                    });
                } else {
                    // Create manual/UTR record if it does not exist
                    await prisma.paymentTransaction.create({
                        data: {
                            userId: userId,
                            orderId: orderId,
                            amount: 3499.0,
                            status: 'PAID',
                            planType: plan as PlanType,
                            startDate: subStartDate,
                            endDate: subEndDate,
                            subscriptionId: subscription.id,
                            paymentMethod: 'UPI_MANUAL'
                        }
                    });
                }
            }

            // Recalculate remaining days
            let remainingDays = 0;
            let isExpired = false;
            if (subscription.endDate) {
                const end = new Date(subscription.endDate);
                const now = new Date();
                const diffTime = end.getTime() - now.getTime();
                remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (remainingDays < 0) {
                    remainingDays = 0;
                    isExpired = true;
                }
            }

            const updatedIsActive = subscription.isActive && !isExpired;

            // Retrieve updated transactions
            const transactions = await prisma.paymentTransaction.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' }
            });

            return res.status(200).json({
                success: true,
                message: "Subscription updated successfully",
                subscription: {
                    id: subscription.id,
                    businessProfileId: subscription.businessProfileId,
                    plan: subscription.plan,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    isActive: updatedIsActive,
                    isExpired: isExpired,
                    remainingDays: remainingDays,
                    createdAt: subscription.createdAt,
                    updatedAt: subscription.updatedAt
                },
                transactions: transactions
            });
        }
    } catch (error: any) {
        console.error("Billing API Error:", error);
        ActivityLogs(userId, '', 'BILLING_API_ERROR', 'ERROR', error.message);
        return res.status(200).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
