/*
  Warnings:

  - You are about to drop the `PosDevice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PosDevice";

-- CreateTable
CREATE TABLE "pos devices" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pos devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pos devices_serialNumber_key" ON "pos devices"("serialNumber");
