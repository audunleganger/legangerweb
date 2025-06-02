import { useEffect, useState } from "react";
import "./App.css";
import type { MealRecord, DateMeal } from "./types";
import {
    getISOWeekNumber,
    getFirstDateOfWeek,
    getLastDateOfWeek,
    formatDateLocal,
    getISOWeeksInYear,
    getWeekAndYearOffset,
    getWeekDates,
    isCurrentDate,
    isDateInPast,
    formatDateToHumanShorthand,
} from "./utils/dateUtils";

const days = [
    "Mandag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
];

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
                                    console.log(dateMeal);
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
