import { prisma } from "@/lib/prisma";

/**
 * Generates a unique lowercase URL slug for a business name.
 * If the business already has a customSlug, returns the existing one.
 */
export async function generateUniqueSlug(businessName: string, userId: string): Promise<string> {
    // Check if the user already has a customSlug
    const existingProfile = await prisma.businessProfile.findUnique({
        where: { userId: userId },
        select: { customSlug: true }
    });
    
    if (existingProfile?.customSlug) {
        return existingProfile.customSlug;
    }

    // Clean name to make a base slug
    const baseSlug = (businessName || "business")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    
    let slug = baseSlug || "business";

    // Loop until we find a unique slug
    let exists = await prisma.businessProfile.findFirst({
        where: { customSlug: slug }
    });
    
    let counter = 1;
    while (exists) {
        slug = `${baseSlug}-${counter}`;
        exists = await prisma.businessProfile.findFirst({
            where: { customSlug: slug }
        });
        counter++;
    }
    
    return slug;
}
