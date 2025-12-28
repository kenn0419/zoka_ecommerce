/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `additionalPrice` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `variantId` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variantName` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "thumbnail",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ALTER COLUMN "variantId" SET NOT NULL,
ALTER COLUMN "variantName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "additionalPrice",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
