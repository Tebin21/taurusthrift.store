/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkText` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkTextAr` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkTextKu` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleAr` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `subtitleKu` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `titleAr` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `titleKu` on the `banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "expiresAt",
DROP COLUMN "linkText",
DROP COLUMN "linkTextAr",
DROP COLUMN "linkTextKu",
DROP COLUMN "linkUrl",
DROP COLUMN "startsAt",
DROP COLUMN "subtitle",
DROP COLUMN "subtitleAr",
DROP COLUMN "subtitleKu",
DROP COLUMN "title",
DROP COLUMN "titleAr",
DROP COLUMN "titleKu";

-- CreateTable
CREATE TABLE "hero_content" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "titleKu" TEXT NOT NULL DEFAULT '',
    "titleAr" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_content_pkey" PRIMARY KEY ("id")
);
