/*
  Warnings:

  - You are about to drop the `dropoff_point` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_area` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "dropoff_point";

-- DropTable
DROP TABLE "service_area";

-- CreateTable
CREATE TABLE "service_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latMin" DOUBLE PRECISION,
    "latMax" DOUBLE PRECISION,
    "lngMin" DOUBLE PRECISION,
    "lngMax" DOUBLE PRECISION,

    CONSTRAINT "service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dropoff_points" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "dropoff_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_areas_name_key" ON "service_areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dropoff_points_name_key" ON "dropoff_points"("name");
