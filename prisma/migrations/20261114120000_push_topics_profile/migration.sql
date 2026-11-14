-- AlterTable
ALTER TABLE "PushSubscription" ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "profile" JSONB;
