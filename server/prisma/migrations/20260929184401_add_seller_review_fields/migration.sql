-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sellerReviewNote" TEXT,
ADD COLUMN     "sellerReviewedAt" TIMESTAMP(3),
ADD COLUMN     "sellerReviewedBy" TEXT;
