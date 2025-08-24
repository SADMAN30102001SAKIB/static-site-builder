-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "forkCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateDescription" TEXT,
ADD COLUMN     "templateTags" TEXT;
