-- CreateTable
CREATE TABLE "booking_settings" (
    "id" SERIAL NOT NULL,
    "minPickupDays" INTEGER NOT NULL DEFAULT 3,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_settings_pkey" PRIMARY KEY ("id")
);
