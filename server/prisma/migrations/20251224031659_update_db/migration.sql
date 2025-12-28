/*
  Warnings:

  - Added the required column `maxPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "hasStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "minPrice" DECIMAL(65,30) NOT NULL;
