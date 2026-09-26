/*
  Warnings:

  - Added the required column `shippingCost` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: add subtotal + shippingCost with backfill for existing rows
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Backfill: existing orders predate split totals; treat stored total as subtotal, shipping 0
UPDATE "Order" SET "subtotal" = "total", "shippingCost" = 0;

ALTER TABLE "Order" ALTER COLUMN "shippingCost" DROP DEFAULT,
ALTER COLUMN "subtotal" DROP DEFAULT;
