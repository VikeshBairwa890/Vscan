-- CreateTable
CREATE TABLE "SmartQrSettings" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "qrDestination" TEXT NOT NULL DEFAULT 'smart-menu',
    "customUrl" TEXT NOT NULL DEFAULT '',
    "primaryColor" TEXT NOT NULL DEFAULT '#7c3aed',
    "secondaryColor" TEXT NOT NULL DEFAULT '#4f46e5',
    "gradientEnabled" BOOLEAN NOT NULL DEFAULT false,
    "qrDesignPattern" TEXT NOT NULL DEFAULT 'classic',
    "selectedFlyerLayout" TEXT NOT NULL DEFAULT 'table-stand',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartQrSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmartQrSettings_businessProfileId_key" ON "SmartQrSettings"("businessProfileId");

-- CreateIndex
CREATE INDEX "SmartQrSettings_businessProfileId_idx" ON "SmartQrSettings"("businessProfileId");

-- AddForeignKey
ALTER TABLE "SmartQrSettings" ADD CONSTRAINT "SmartQrSettings_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
