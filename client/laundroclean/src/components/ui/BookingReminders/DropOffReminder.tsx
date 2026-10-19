import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGetClientbookings } from "src/hooks/booking/useBooking";

export function DropOffReminder() {
    const router = useRouter();
    const { data } = useGetClientbookings({
        params: {
            status: "CONFIRMED",
            includeProfile: false
        }
    })

    const bookingData = data?.data && Array.isArray(data.data)
        ? data.data
        : [];

    const notifiedBookings = useRef(new Set<string>());

    useEffect(() => {
        if (!bookingData.length) return;

        const awaitingDropoff = bookingData.filter(
            (booking) =>
                booking.status === "CONFIRMED" &&
                booking.deliveryType === "DROP_OFF"
        )

        // console.log("Awaiting",awaitingDropoff.length)

        awaitingDropoff.forEach((booking) => {
            if (notifiedBookings.current.has(booking.id)) {
                return;
            }

            notifiedBookings.current.add(booking.id);

            toast('Booking requires drop-off', {
                description: `Booking ${booking.customBookingId} requires drop-off, see nearest drop off location to you.
                Then head over to booking to update the booking status when items have been dropped off`,
                duration: Infinity,
                action: {
                    label: 'View',
                    onClick: () => {
                        router.push('laundroclean-services?dropOff=true')
                    }
                }
            })
        })


    }, [bookingData, router])

    return null;
}