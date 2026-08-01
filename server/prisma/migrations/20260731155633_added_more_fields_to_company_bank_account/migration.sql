/*
  Warnings:

  - Added the required column `accountNumber` to the `company bank accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `company bank accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company bank accounts" ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
