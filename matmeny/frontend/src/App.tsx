import { useEffect, useState } from "react";
import "./App.css";
// import type { DateMeal } from "./types";
import useMeals from "./hooks/useMeals";
import {
    getISOWeekNumber,
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

const currentDate = new Date();
const currentWeekNum = getISOWeekNumber(currentDate);

function App() {
    const [selectedWeekNum, setSelectedWeekNum] = useState(currentWeekNum);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [weeksToShow, setWeeksToShow] = useState(2);

    const { meals, loading, error, fetchMeals } = useMeals(
        selectedWeekNum,
        selectedYear,
        weeksToShow
    );

    if (error) {
        console.log(error);
    }
    useEffect(() => {
        fetchMeals();
    }, [fetchMeals]);

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
            {loading ? (
                <h1>Loading</h1>
            ) : (
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
                        {Array.from(
                            { length: weeksToShow },
                            (_, weekOffset) => {
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
                                            const dateString =
                                                formatDateLocal(date);
                                            const dateMeal = meals.find(
                                                (meal) =>
                                                    meal.date === dateString
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
                                                    {dateMeal ? (
                                                        dateMeal.meal.name
                                                    ) : (
                                                        <br></br>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            )}
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
