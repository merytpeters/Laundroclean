/*
  Warnings:

  - A unique constraint covering the columns `[providerRef,eventType]` on the table `payment events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment events_providerRef_eventType_key" ON "payment events"("providerRef", "eventType");
