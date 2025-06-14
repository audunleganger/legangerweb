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
import { fetchWithAuth } from "../utils/fetchWithAuth";

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
    loggedInStatus: boolean;
};

export const MealTable: React.FC<MealTableProps> = ({
    meals,
    weeksToShow,
    selectedWeekNum,
    selectedYear,
    fetchMeals,
    loggedInStatus,
}) => {
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleCellClick = (date: string, currentMeal?: string) => {
        if (!loggedInStatus) {
            alert("Du må være logget inn for å redigere måltider.");
            return;
        }
        setEditingDate(date);
        setInputValue(currentMeal || "");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = async (date: string, isUpdate: boolean) => {
        setSubmitting(true);
        try {
            const method = isUpdate ? "PUT" : "POST";
            const url = isUpdate ? `/api/meals/${date}` : `/api/meals`;
            const body = isUpdate
                ? JSON.stringify({ meal_name: inputValue })
                : JSON.stringify({ date, meal_name: inputValue });
            await fetchWithAuth(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                    )}`,
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

    const renderCell = (date: Date, dateMeal?: DateMeal) => {
        const dateString = formatDateLocal(date);
        const isEditing = editingDate === dateString;
        return (
            <td
                key={dateString}
                className={[
                    isCurrentDate(date)
                        ? "current-date"
                        : isDateInPast(date)
                        ? "past-date"
                        : "",
                    loggedInStatus ? "clickable" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onClick={() =>
                    !isEditing &&
                    handleCellClick(dateString, dateMeal?.meal.name)
                }
            >
                <span className="date">{formatDateToHumanShorthand(date)}</span>
                <br />
                {isEditing ? (
                    <input
                        type="text"
                        className="meal-name-input"
                        autoFocus
                        value={inputValue}
                        disabled={submitting}
                        onChange={handleInputChange}
                        onBlur={() => handleInputBlur(dateString, !!dateMeal)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                    />
                ) : dateMeal?.meal.name ? (
                    <span className="meal-name-text">{dateMeal.meal.name}</span>
                ) : (
                    <br />
                )}
            </td>
        );
    };

    return (
        <table>
            <thead>
                <tr>
                    <th className="week-col week-col-header">Uke</th>
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
                            <td className="week-col week-num">{`${week}`}</td>
                            {weekDates.map((date) => {
                                const dateString = formatDateLocal(date);
                                const dateMeal = meals.find(
                                    (meal) => meal.date === dateString
                                );
                                return renderCell(date, dateMeal);
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
