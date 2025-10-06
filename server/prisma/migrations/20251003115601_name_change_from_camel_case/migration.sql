/*
  Warnings:

  - The primary key for the `booking notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookingId` on the `booking notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `booking notifications` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `booking notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notification_id` to the `booking notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."booking notifications" DROP CONSTRAINT "booking notifications_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."booking notifications" DROP CONSTRAINT "booking notifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropIndex
DROP INDEX "public"."profiles_userId_key";

-- AlterTable
ALTER TABLE "public"."booking notifications" DROP CONSTRAINT "booking notifications_pkey",
DROP COLUMN "bookingId",
DROP COLUMN "notificationId",
ADD COLUMN     "booking_id" TEXT NOT NULL,
ADD COLUMN     "notification_id" TEXT NOT NULL,
ADD CONSTRAINT "booking notifications_pkey" PRIMARY KEY ("booking_id", "notification_id");

-- AlterTable
ALTER TABLE "public"."bookings" DROP COLUMN "addressId",
DROP COLUMN "profileId",
DROP COLUMN "serviceId",
ADD COLUMN     "address_id" TEXT,
ADD COLUMN     "profile_id" TEXT NOT NULL,
ADD COLUMN     "service_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "public"."profiles" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "public"."profiles"("user_id");

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking notifications" ADD CONSTRAINT "booking notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking notifications" ADD CONSTRAINT "booking notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
