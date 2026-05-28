/*
  Warnings:

  - A unique constraint covering the columns `[transactionRef]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionRef` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transactionRef" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionRef_key" ON "transactions"("transactionRef");
