/*
  Warnings:

  - You are about to drop the `serviceArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "serviceArea";

-- CreateTable
CREATE TABLE "service_area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latMin" DOUBLE PRECISION,
    "latMax" DOUBLE PRECISION,
    "lngMin" DOUBLE PRECISION,
    "lngMax" DOUBLE PRECISION,

    CONSTRAINT "service_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_point" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pickup_point_pkey" PRIMARY KEY ("id")
);
