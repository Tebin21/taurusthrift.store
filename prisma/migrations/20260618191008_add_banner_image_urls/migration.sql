-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "imageUrls" TEXT[],
ALTER COLUMN "imageUrl" DROP NOT NULL;
