export function formatDateTime(date: string | Date | null | undefined) {
    if (!date) return "-";

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(date))
}

export const toUTCISOString = (
    date: string,
    time: string
): string => {
    if (!date || !time) {
        throw new Error("Date and time are required");
    }

    const localDate = new Date(`${date}T${time}:00`);

    if (Number.isNaN(localDate.getTime())) {
        throw new Error(`Invalid date or time: ${date} ${time}`);
    }

    return localDate.toISOString();
};

export function getMinPickupDate(minPickupDays: number): string {
    const date = new Date();

    date.setDate(date.getDate() + minPickupDays);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}