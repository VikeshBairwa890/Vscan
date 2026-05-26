-- CreateTable
CREATE TABLE "AiSuggestion" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "keywords" TEXT[],
    "cacheStatus" TEXT NOT NULL DEFAULT 'empty',
    "generatedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiSuggestion_businessProfileId_key" ON "AiSuggestion"("businessProfileId");

-- CreateIndex
CREATE INDEX "AiSuggestion_businessProfileId_idx" ON "AiSuggestion"("businessProfileId");

-- AddForeignKey
ALTER TABLE "AiSuggestion" ADD CONSTRAINT "AiSuggestion_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
