// Helper function to convert a Date to datetime-local input format in local timezone
export function toLocalDateTimeString(date: Date | string | null | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Helper function to get current date/time in local timezone for datetime-local input
export function getCurrentLocalDateTime(): string {
    return toLocalDateTimeString(new Date());
}
