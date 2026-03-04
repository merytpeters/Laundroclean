/*
  Warnings:

  - The values [PER_KG,PER_ITEM,FLAT_RATE] on the enum `PricingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PricingType_new" AS ENUM ('PER KG', 'PER ITEM', 'FLAT RATE');
ALTER TABLE "service_prices" ALTER COLUMN "pricing_type" TYPE "PricingType_new" USING ("pricing_type"::text::"PricingType_new");
ALTER TABLE "bookings" ALTER COLUMN "pricing_type" TYPE "PricingType_new" USING ("pricing_type"::text::"PricingType_new");
ALTER TYPE "PricingType" RENAME TO "PricingType_old";
ALTER TYPE "PricingType_new" RENAME TO "PricingType";
DROP TYPE "public"."PricingType_old";
COMMIT;
