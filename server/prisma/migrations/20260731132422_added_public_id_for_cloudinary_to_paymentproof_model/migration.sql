/*
  Warnings:

  - Added the required column `publidId` to the `payment proofs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment proofs" ADD COLUMN     "publidId" TEXT NOT NULL;
