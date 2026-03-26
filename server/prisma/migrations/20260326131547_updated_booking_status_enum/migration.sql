/*
  Warnings:

  - The values [DROPPED OFF,PICKED UP] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'DELIVERED', 'CUSTOMER DROPPED OFF AT POINT', 'CUSTOMER PICKED UP FROM POINT', 'COMPANY PICKED UP FROM CUSTOMER', 'COMPANY PICKED UP FROM POINT', 'COMPANY DROPPED OFF AT POINT');
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
COMMIT;
