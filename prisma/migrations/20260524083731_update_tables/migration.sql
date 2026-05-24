-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "BusinessLogo" TEXT,
ADD COLUMN     "isQrGenerated" BOOLEAN NOT NULL DEFAULT false;
