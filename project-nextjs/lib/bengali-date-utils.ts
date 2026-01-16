// Utility functions for Bengali date and time formatting

/**
 * Converts English digits to Bengali digits
 */
export function toBengaliDigits(num: string | number): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}

/**
 * Gets Bengali time period based on hour (24-hour format)
 * ভোর (dawn): 4-6
 * সকাল (morning): 6-12
 * দুপুর (noon): 12-15
 * বিকাল (afternoon): 15-18
 * সন্ধ্যা (evening): 18-20
 * রাত (night): 20-4
 */
export function getBengaliTimePeriod(hour: number): string {
    if (hour >= 4 && hour < 6) return 'ভোর';
    if (hour >= 6 && hour < 12) return 'সকাল';
    if (hour >= 12 && hour < 15) return 'দুপুর';
    if (hour >= 15 && hour < 18) return 'বিকাল';
    if (hour >= 18 && hour < 20) return 'সন্ধ্যা';
    return 'রাত';
}

/**
 * Formats date with Bengali time period
 * Example output: ২০ নভেম্বর, ২০২৫ বিকাল ৪:৫২
 */
export function formatBengaliDateTime(dateString: string): string {
    const date = new Date(dateString);

    // Get date part in Bengali
    const datePart = date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get hour and minute
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Convert to 12-hour format
    const hour12 = hour % 12 || 12;

    // Get Bengali time period
    const timePeriod = getBengaliTimePeriod(hour);

    // Format time with Bengali digits
    const timeString = `${toBengaliDigits(hour12)}:${toBengaliDigits(minute.toString().padStart(2, '0'))}`;

    return `${datePart} ${timePeriod} ${timeString}`;
}
