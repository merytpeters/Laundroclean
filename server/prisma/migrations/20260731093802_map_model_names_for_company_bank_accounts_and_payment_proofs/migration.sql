-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "companyBankAccountId" TEXT,
ADD COLUMN     "senderAccountName" TEXT,
ADD COLUMN     "senderBankName" TEXT,
ADD COLUMN     "senderTransactionRef" TEXT,
ADD COLUMN     "transferredAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "company bank accounts" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "company bank accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment proofs" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment proofs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_companyBankAccountId_fkey" FOREIGN KEY ("companyBankAccountId") REFERENCES "company bank accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment proofs" ADD CONSTRAINT "payment proofs_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
