-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- Backfill: preserve existing DELIVERED orders as completed sales using their last update time
UPDATE "orders" SET "completedAt" = "updatedAt" WHERE "status" = 'DELIVERED' AND "completedAt" IS NULL;
