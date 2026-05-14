/*
  Warnings:

  - You are about to drop the `booking_notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dropoff_points` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promo_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promo_usages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_areas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff_calendar` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'OPAY');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'REVERSED');

-- DropForeignKey
ALTER TABLE "booking_notifications" DROP CONSTRAINT "booking_notifications_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_notifications" DROP CONSTRAINT "booking_notifications_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_promo_code_id_fkey";

-- DropForeignKey
ALTER TABLE "promo_codes" DROP CONSTRAINT "promo_codes_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "promo_usages" DROP CONSTRAINT "promo_usages_promoCodeId_fkey";

-- DropForeignKey
ALTER TABLE "promo_usages" DROP CONSTRAINT "promo_usages_userId_fkey";

-- DropForeignKey
ALTER TABLE "service_prices" DROP CONSTRAINT "service_prices_service_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_calendar" DROP CONSTRAINT "staff_calendar_userId_fkey";

-- DropForeignKey
ALTER TABLE "timeslots" DROP CONSTRAINT "timeslots_staffCalendarId_fkey";

-- DropTable
DROP TABLE "booking_notifications";

-- DropTable
DROP TABLE "booking_settings";

-- DropTable
DROP TABLE "dropoff_points";

-- DropTable
DROP TABLE "promo_codes";

-- DropTable
DROP TABLE "promo_usages";

-- DropTable
DROP TABLE "service_areas";

-- DropTable
DROP TABLE "service_prices";

-- DropTable
DROP TABLE "staff_calendar";

-- CreateTable
CREATE TABLE "service prices" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL,
    "pricing_type" "PricingType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latMin" DOUBLE PRECISION,
    "latMax" DOUBLE PRECISION,
    "lngMin" DOUBLE PRECISION,
    "lngMax" DOUBLE PRECISION,

    CONSTRAINT "service areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dropoff points" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "dropoff points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking settings" (
    "id" SERIAL NOT NULL,
    "minPickupDays" INTEGER NOT NULL DEFAULT 3,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff calendar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking notifications" (
    "booking_id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,

    CONSTRAINT "booking notifications_pkey" PRIMARY KEY ("booking_id","notification_id")
);

-- CreateTable
CREATE TABLE "promo codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "serviceId" TEXT NOT NULL,
    "type" "PromoType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "currency" "Currency",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "usageLimit" INTEGER,
    "perUserLimit" INTEGER,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "promo codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo usages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "platformFee" INTEGER NOT NULL DEFAULT 0,
    "merchantAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'NAIRA',
    "provider" "PaymentProvider",
    "providerRef" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerRef" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" INTEGER NOT NULL,
    "channel" TEXT,
    "authorization" JSONB,
    "currency" "Currency" NOT NULL DEFAULT 'NAIRA',
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment events" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "eventType" TEXT NOT NULL,
    "providerRef" TEXT,
    "payload" JSONB NOT NULL,
    "signature" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service prices_service_id_is_active_idx" ON "service prices"("service_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "service areas_name_key" ON "service areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dropoff points_name_key" ON "dropoff points"("name");

-- CreateIndex
CREATE UNIQUE INDEX "promo codes_code_key" ON "promo codes"("code");

-- CreateIndex
CREATE INDEX "promo usages_userId_promoCodeId_idx" ON "promo usages"("userId", "promoCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_bookingId_key" ON "transactions"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_providerRef_key" ON "transactions"("providerRef");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerRef_key" ON "payments"("providerRef");

-- AddForeignKey
ALTER TABLE "service prices" ADD CONSTRAINT "service prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff calendar" ADD CONSTRAINT "staff calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeslots" ADD CONSTRAINT "timeslots_staffCalendarId_fkey" FOREIGN KEY ("staffCalendarId") REFERENCES "staff calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking notifications" ADD CONSTRAINT "booking notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking notifications" ADD CONSTRAINT "booking notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo codes" ADD CONSTRAINT "promo codes_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo usages" ADD CONSTRAINT "promo usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo usages" ADD CONSTRAINT "promo usages_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "promo codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment events" ADD CONSTRAINT "payment events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
