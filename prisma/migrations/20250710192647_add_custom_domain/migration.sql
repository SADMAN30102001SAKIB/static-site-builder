/*
  Warnings:

  - A unique constraint covering the columns `[customDomain]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "domainVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Website_customDomain_key" ON "Website"("customDomain");
