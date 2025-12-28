/*
  Warnings:

  - Added the required column `priceSnapshot` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockSnapshot` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "priceSnapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "stockSnapshot" INTEGER NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "variantName" TEXT;
