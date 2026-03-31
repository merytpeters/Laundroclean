/*
  Warnings:

  - The primary key for the `booking_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `booking_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "booking_settings" DROP CONSTRAINT "booking_settings_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "booking_settings_pkey" PRIMARY KEY ("id");
