/*
  Warnings:

  - You are about to drop the `pickup_point` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pickup_point";

-- CreateTable
CREATE TABLE "dropoff_point" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "dropoff_point_pkey" PRIMARY KEY ("id")
);
