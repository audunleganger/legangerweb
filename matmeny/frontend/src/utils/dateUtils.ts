export const getWeekAndYearOffset = (
    startWeek: number,
    startYear: number,
    offset: number
) => {
    let week = startWeek;
    let year = startYear;
    for (let i = 0; i < offset; i++) {
        const weeksInYear = getISOWeeksInYear(year);
        if (week < weeksInYear) {
            week++;
        } else {
            week = 1;
            year++;
        }
    }
    return { week, year };
};

export const getISOWeekNumber = (date: Date): number => {
    // Create a copy of the date to avoid mutating the original date
    const tempDate = new Date(date.getTime());
    // Set the time to midnight to ensure consistent week calculations
    tempDate.setHours(0, 0, 0, 0);
    // Set the date to the nearest Thursday (ISO week starts on Monday)
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    // Get the first week of the year
    const firstWeek = new Date(tempDate.getFullYear(), 0, 4);
    // Calculate the week number
    return (
        1 +
        Math.round(
            ((tempDate.getTime() - firstWeek.getTime()) / 86400000 -
                3 +
                ((firstWeek.getDay() + 6) % 7)) /
                7
        )
    );
};

export const getISOWeeksInYear = (year: number): number => {
    return getISOWeekNumber(new Date(year, 11, 28)); // December 28 is always in the last week of the year
};

export const getWeekDates = (weekNumber: number, year: number): Date[] => {
    const firstDateOfWeek = getFirstDateOfWeek(weekNumber, year);
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(firstDateOfWeek);
        date.setDate(firstDateOfWeek.getDate() + i);
        return date;
    });
};

export const getFirstDateOfWeek = (weekNumber: number, year: number): Date => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const firstDateOfWeek = new Date(firstDayOfYear);
    firstDateOfWeek.setDate(firstDayOfYear.getDate() + daysOffset);
    // Adjust to the first Monday of the week
    const dayOfWeek = firstDateOfWeek.getDay();
    const mondayOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Adjust if Sunday
    firstDateOfWeek.setDate(firstDateOfWeek.getDate() + mondayOffset);
    return firstDateOfWeek;
};

export const getLastDateOfWeek = (weekNumber: number, year: number): Date => {
    const firstDateOfWeek = getFirstDateOfWeek(weekNumber, year);
    const lastDateOfWeek = new Date(firstDateOfWeek);
    lastDateOfWeek.setDate(firstDateOfWeek.getDate() + 6); // Add 6 days to get the last date of the week
    return lastDateOfWeek;
};

export const formatDateLocal = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const formatDateToHumanShorthand = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("nb-NO", { month: "short" });
    return `${day}. ${monthShort}`;
};

export const isCurrentDate = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getFullYear() < today.getFullYear() ||
        (date.getFullYear() === today.getFullYear() &&
            (date.getMonth() < today.getMonth() ||
                (date.getMonth() === today.getMonth() &&
                    date.getDate() < today.getDate())))
    );
};
