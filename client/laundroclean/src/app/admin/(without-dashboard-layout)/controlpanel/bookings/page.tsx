"use client";
import { LoadingState } from "src/components/ui/ErrorState/ErrorState";
import { AdminAllBookings } from "src/components/ui/flexboxes/BookingDisplayTable";
import { useGetbookings } from "src/hooks/booking/useBooking";
import { mapDeliveryType } from "src/types/booking/bookingStatus";
import { mapCurrencySymbol } from "src/types/laundrocleanServices/laundroservices";
import { transformFieldInArray } from "src/utils/mapData";
import Pagination from "src/components/ui/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "src/hooks/debounceHook";

export default function AllBookingsInfo() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const debouncedSearch = useDebounce(search, 500);
    const queryParams = {
        page,
        limit,
        debouncedSearch
    }
    const { data, isLoading: bookingDataLoadingState } = useGetbookings({
        params: {
            ...queryParams,
            includeProfile: true,
        }
    });

    const bookingData = Array.isArray(data?.data)
        ? data.data
        : [];

    const mappedCurrency = transformFieldInArray(
        bookingData,
        "currency",
        mapCurrencySymbol
    );

    const mappedBookingData = transformFieldInArray(
        mappedCurrency,
        "deliveryType",
        mapDeliveryType
    );

    const metaData = data?.meta;

    if (bookingDataLoadingState) return <LoadingState />;

    return (
        <div style={{ color: "#000", width: "100%", background: "#eeecec57" }}>
            <AdminAllBookings mappedBookingData={mappedBookingData} />
            <span className="pagination-global">
                <Pagination
                    totalPages={
                        metaData?.totalPages ?? 1
                    }
                />
            </span>
        </div>
    )
}