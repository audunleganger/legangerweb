import { useEffect, useState } from "react";
import "./App.css";

// type Meal = {
//     name: string;
//     ingredients?: string[];
// };

type DateMeal = {
    date: string;
    meal: {
        name: string;
    };
};

type MealRecord = {
    date: string;
    meal_name: string;
};

const days = [
    "Mandag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
];

const getWeekAndYearOffset = (
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

const getISOWeekNumber = (date: Date): number => {
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

const getISOWeeksInYear = (year: number): number => {
    return getISOWeekNumber(new Date(year, 11, 28)); // December 28 is always in the last week of the year
};

const getWeekDates = (weekNumber: number, year: number): Date[] => {
    const firstDateOfWeek = getFirstDateOfWeek(weekNumber, year);
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(firstDateOfWeek);
        date.setDate(firstDateOfWeek.getDate() + i);
        return date;
    });
};

const getFirstDateOfWeek = (weekNumber: number, year: number): Date => {
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

const getLastDateOfWeek = (weekNumber: number, year: number): Date => {
    const firstDateOfWeek = getFirstDateOfWeek(weekNumber, year);
    const lastDateOfWeek = new Date(firstDateOfWeek);
    lastDateOfWeek.setDate(firstDateOfWeek.getDate() + 6); // Add 6 days to get the last date of the week
    return lastDateOfWeek;
};

const formatDateLocal = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const formatDateToHumanShorthand = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const monthShort = date.toLocaleString("nb-NO", { month: "short" });
    return `${day}. ${monthShort}`;
};

const isCurrentDate = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getFullYear() < today.getFullYear() ||
        (date.getFullYear() === today.getFullYear() &&
            (date.getMonth() < today.getMonth() ||
                (date.getMonth() === today.getMonth() &&
                    date.getDate() < today.getDate())))
    );
};
const currentDate = new Date(); // April 28, 2025
const currentWeekNum = getISOWeekNumber(currentDate);

function App() {
    const [fetchedDateMeals, setFetchedDateMeals] = useState<DateMeal[]>([]);
    const [selectedWeekNum, setSelectedWeekNum] = useState(currentWeekNum);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [weeksToShow, setWeeksToShow] = useState(2);

    useEffect(() => {
        const fetchData = async () => {
            const startDate = getFirstDateOfWeek(selectedWeekNum, selectedYear);
            const endDate = getLastDateOfWeek(
                selectedWeekNum + weeksToShow - 1,
                selectedYear
            );

            const res = await fetch(
                `/api/meals?from=${formatDateLocal(
                    startDate
                )}&to=${formatDateLocal(endDate)}`
            );

            if (!res.ok) {
                console.error("Failed to fetch meals:", res.statusText);
                return;
            }
            console.log(res.url);
            const recordsFetched = await res.json();
            const mealsReturned: DateMeal[] = recordsFetched.map(
                (meal: MealRecord) => ({
                    date: meal.date.split("T")[0], // Extract date part
                    meal: {
                        name: meal.meal_name,
                    },
                })
            );
            console.log(mealsReturned);
            setFetchedDateMeals(mealsReturned);
        };
        fetchData();
    }, [selectedWeekNum, weeksToShow, selectedYear]);

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

    return (
        <>
            <h1>År: {selectedYear}</h1>
            <button onClick={goToPrevWeek}>Forrige</button>
            <button onClick={goToNextWeek}>Neste</button>
            <table>
                <thead>
                    <tr>
                        <th>Uke</th>
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: weeksToShow }, (_, weekOffset) => {
                        const { week, year } = getWeekAndYearOffset(
                            selectedWeekNum,
                            selectedYear,
                            weekOffset
                        );
                        const weekDates = getWeekDates(week, year);
                        return (
                            <tr key={`${year}-w${week}`}>
                                <td className="date-cell">{`${week}`}</td>
                                {weekDates.map((date) => {
                                    const dateString = formatDateLocal(date);
                                    const dateMeal = fetchedDateMeals.find(
                                        (meal) => meal.date === dateString
                                    );
                                    return (
                                        <td
                                            key={dateString}
                                            className={
                                                isCurrentDate(date)
                                                    ? "current-date"
                                                    : isDateInPast(date)
                                                    ? "past-date"
                                                    : ""
                                            }
                                        >
                                            <span className="date">
                                                {formatDateToHumanShorthand(
                                                    date
                                                )}
                                            </span>
                                            <br />
                                            {dateMeal ? dateMeal.meal.name : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button
                disabled={weeksToShow <= 1}
                onClick={() => {
                    setWeeksToShow((prev) => Math.max(prev - 1, 1));
                }}
            >
                Færre rader
            </button>
            <button
                disabled={weeksToShow >= 4}
                onClick={() => {
                    setWeeksToShow((prev) => Math.min(prev + 1, 4));
                }}
            >
                Flere rader
            </button>
        </>
    );
}

export default App;
