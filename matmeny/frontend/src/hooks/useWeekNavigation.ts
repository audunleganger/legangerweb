import { useState } from "react";
import { getISOWeekNumber, getISOWeeksInYear } from "../utils/dateUtils";

export const useWeekNavigation = (initialDate = new Date()) => {
    const [selectedWeekNum, setSelectedWeekNum] = useState(
        getISOWeekNumber(initialDate)
    );
    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

    const goToPrevWeek = () => {
        if (selectedWeekNum > 1) {
            setSelectedWeekNum((prev) => prev - 1);
        } else {
            const weeksInPrevYear = getISOWeeksInYear(selectedYear - 1);
            setSelectedWeekNum(weeksInPrevYear);
            setSelectedYear((prev) => prev - 1);
        }
    };

    const goToNextWeek = () => {
        const weeksInCurrentYear = getISOWeeksInYear(selectedYear);
        if (selectedWeekNum < weeksInCurrentYear) {
            setSelectedWeekNum((prev) => prev + 1);
        } else {
            setSelectedWeekNum(() => 1);
            setSelectedYear((prev) => prev + 1);
        }
    };

    return {
        selectedWeekNum,
        // setSelectedWeekNum,
        selectedYear,
        // setSelectedYear,
        goToPrevWeek,
        goToNextWeek,
    };
};
