-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('COURSE', 'VLOG', 'WORKSHOP');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "ContentType" NOT NULL DEFAULT 'COURSE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE';

-- CreateIndex
CREATE INDEX "Course_type_idx" ON "Course"("type");

-- CreateIndex
CREATE INDEX "Course_isPremium_idx" ON "Course"("isPremium");

-- CreateIndex
CREATE INDEX "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");
