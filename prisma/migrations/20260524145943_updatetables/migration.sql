-- CreateTable
CREATE TABLE "MiniWebsiteInfo" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiniWebsiteInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MiniWebsiteInfo_businessProfileId_key" ON "MiniWebsiteInfo"("businessProfileId");

-- CreateIndex
CREATE INDEX "MiniWebsiteInfo_businessProfileId_idx" ON "MiniWebsiteInfo"("businessProfileId");

-- AddForeignKey
ALTER TABLE "MiniWebsiteInfo" ADD CONSTRAINT "MiniWebsiteInfo_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
