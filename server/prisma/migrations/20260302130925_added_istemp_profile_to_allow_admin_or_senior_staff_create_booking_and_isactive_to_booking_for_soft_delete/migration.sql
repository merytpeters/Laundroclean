-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "isTemp" BOOLEAN NOT NULL DEFAULT false;
