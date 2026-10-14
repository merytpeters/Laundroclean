-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "drop_off_point_id" TEXT;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_drop_off_point_id_fkey" FOREIGN KEY ("drop_off_point_id") REFERENCES "dropoff points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
