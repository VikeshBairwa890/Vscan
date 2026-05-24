// make a common function, this function i call in every service or folder or method, to catch errors, monitor user activity
// i will pass req, res, userId, action, entity, entityId, details, ipAddress, userAgent, message, success
// you have to 

import { prisma } from "@/lib/prisma";


export default async function ActivityLogs(userId: string, businessProfileId: string, action: string, serviceName: string, message: string) {
    try {
        const activityLog = await prisma.activityLog.create({
            data: {
                userId: userId,
                businessProfileId: businessProfileId || "",
                action: action,
                entity: serviceName,
                details: message,
                createdAt: new Date(),
            }
        });
        return true;
    } catch (error: any) {
        return false;
    }
}