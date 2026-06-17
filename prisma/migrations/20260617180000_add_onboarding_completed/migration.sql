-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- Mark existing profiles with category as already onboarded
UPDATE "BusinessProfile" SET "onboardingCompleted" = true WHERE "category" IS NOT NULL AND TRIM("category") <> '';
