import { useState } from "react";
import type { DateMeal } from "../types";
import {
    formatDateLocal,
    getWeekAndYearOffset,
    getWeekDates,
    isCurrentDate,
    isDateInPast,
    formatDateToHumanShorthand,
} from "../utils/dateUtils";
import type React from "react";

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
    fetchMeals: () => void;
};

export const MealTable: React.FC<MealTableProps> = ({
    meals,
    weeksToShow,
    selectedWeekNum,
    selectedYear,
    fetchMeals,
}) => {
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleCellClick = (date: string, currentMeal?: string) => {
        setEditingDate(date);
        setInputValue(currentMeal || "");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = async (
        date: string,
        isUpdate: boolean
        // refresh: () => void
    ) => {
        if (!inputValue.trim()) {
            setEditingDate(null);
            return;
        }
        setSubmitting(true);
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/meals/${date}` : `/api/meals`;
            const body = isUpdate
                ? JSON.stringify({ meal_name: inputValue })
                : JSON.stringify({ date, meal_name: inputValue });
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
            fetchMeals();
        } catch (error) {
            console.error("Error saving meal:", error);
        } finally {
            setSubmitting(false);
            setEditingDate(null);
            setInputValue("");
        }
    };

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
                                const isEditing = editingDate === dateString;
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
                                        onClick={() =>
                                            !isEditing &&
                                            handleCellClick(
                                                dateString,
                                                dateMeal?.meal.name
                                            )
                                        }
                                    >
                                        <span className="date">
                                            {formatDateToHumanShorthand(date)}
                                        </span>
                                        <br />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={inputValue}
                                                autoFocus
                                                disabled={submitting}
                                                onChange={handleInputChange}
                                                onBlur={() =>
                                                    handleInputBlur(
                                                        dateString,
                                                        !!dateMeal
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).blur();
                                                    }
                                                }}
                                            />
                                        ) : dateMeal ? (
                                            dateMeal.meal.name
                                        ) : (
                                            <br />
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
