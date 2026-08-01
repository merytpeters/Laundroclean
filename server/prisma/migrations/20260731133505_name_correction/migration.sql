/*
  Warnings:

  - You are about to drop the column `publidId` on the `payment proofs` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `payment proofs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment proofs" DROP COLUMN "publidId",
ADD COLUMN     "publicId" TEXT NOT NULL;
