import type React from "react";
import type { DateMeal } from "../types";
import {
    formatDateLocal,
    getWeekAndYearOffset,
    getWeekDates,
    isCurrentDate,
    isDateInPast,
    formatDateToHumanShorthand,
} from "../utils/dateUtils";

const days = [
    "Mandag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
];

type MealTableProps = {
    meals: DateMeal[];
    weeksToShow: number;
    selectedWeekNum: number;
    selectedYear: number;
};

export const MealTable: React.FC<MealTableProps> = ({
    meals,
    weeksToShow,
    selectedWeekNum,
    selectedYear,
}) => {
    return (
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
                                const dateMeal = meals.find(
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
                                            {formatDateToHumanShorthand(date)}
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
                })}
            </tbody>
        </table>
    );
};
