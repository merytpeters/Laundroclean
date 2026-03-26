/*
  Warnings:

  - You are about to drop the `ServiceArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ServiceArea";

-- CreateTable
CREATE TABLE "serviceArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "latMin" DOUBLE PRECISION,
    "latMax" DOUBLE PRECISION,
    "lngMin" DOUBLE PRECISION,
    "lngMax" DOUBLE PRECISION,

    CONSTRAINT "serviceArea_pkey" PRIMARY KEY ("id")
);
