"use client";
import { AdminAllBookings } from "src/components/ui/flexboxes/BookingDisplayTable";

//import Pagination from "src/components/ui/Pagination";

export default function AllBookingsInfo () {

    return (
        <div style={{ color: "#000", width: "100%", background: "#eeecec57"}}>
            <AdminAllBookings />
            {/*<Pagination totalPages={}/>*/}
        </div>
    )
}