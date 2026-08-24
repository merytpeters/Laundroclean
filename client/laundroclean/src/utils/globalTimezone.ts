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