-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('DOLLAR', 'NAIRA', 'POUNDS');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DeliveryType" AS ENUM ('DROP OFF', 'PICK UP');

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "types" "public"."NotificationType"[],
    "title" TEXT,
    "message" TEXT NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL,
    "sent_at" TIMESTAMP(3),
    "priority" "public"."NotificationPriority" NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "custom_booking_id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "public"."BookingStatus" NOT NULL,
    "delivery_type" "public"."DeliveryType" NOT NULL,
    "scheduled_date" TIMESTAMP(3),
    "pickup_time" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "item_count" INTEGER,
    "addressId" TEXT,
    "additional_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking notifications" (
    "bookingId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "booking notifications_pkey" PRIMARY KEY ("bookingId","notificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_custom_booking_id_key" ON "public"."bookings"("custom_booking_id");

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking notifications" ADD CONSTRAINT "booking notifications_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking notifications" ADD CONSTRAINT "booking notifications_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "public"."notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
