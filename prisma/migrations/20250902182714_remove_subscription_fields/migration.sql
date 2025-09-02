/*
  Warnings:

  - You are about to drop the column `stripeCurrentPeriodEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "public"."User_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "stripeCurrentPeriodEnd",
DROP COLUMN "stripeSubscriptionId";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropEnum
DROP TYPE "public"."SubscriptionStatus";
