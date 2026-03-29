/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `dropoff_point` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `service_area` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dropoff_point_name_key" ON "dropoff_point"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_area_name_key" ON "service_area"("name");
