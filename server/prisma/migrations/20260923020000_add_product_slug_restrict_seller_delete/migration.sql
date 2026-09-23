-- Add slug column as nullable, backfill from name, then enforce NOT NULL + UNIQUE
ALTER TABLE "Product" ADD COLUMN "slug" TEXT;

UPDATE "Product" SET "slug" = lower(regexp_replace(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) WHERE "slug" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- Restrict seller delete (was Cascade)
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
