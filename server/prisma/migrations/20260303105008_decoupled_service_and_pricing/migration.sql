/*
  Warnings:

  - You are about to drop the column `currency` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `services` table. All the data in the column will be lost.
  - Added the required column `currency` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricing_type` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('PER_KG', 'PER_ITEM', 'FLAT_RATE');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "currency" "Currency" NOT NULL,
ADD COLUMN     "pricing_type" "PricingType" NOT NULL,
ADD COLUMN     "total_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "unit_price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "currency",
DROP COLUMN "price",
ALTER COLUMN "is_active" SET DEFAULT true;

-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL,
    "pricing_type" "PricingType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_prices_service_id_is_active_idx" ON "service_prices"("service_id", "is_active");

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
