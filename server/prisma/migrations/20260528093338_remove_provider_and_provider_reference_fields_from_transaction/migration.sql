/*
  Warnings:

  - You are about to drop the column `provider` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `providerRef` on the `transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "transactions_providerRef_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "provider",
DROP COLUMN "providerRef";
