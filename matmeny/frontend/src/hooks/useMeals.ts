import { useCallback, useState } from "react";
import type { DateMeal, MealRecord } from "../types";
import {
    formatDateLocal,
    getFirstDateOfWeek,
    getLastDateOfWeek,
} from "../utils/dateUtils";

export function useMeals(
    selectedWeekNum: number,
    selectedYear: number,
    weeksToShow: number
) {
    const [meals, setMeals] = useState<DateMeal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMeals = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
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
                throw new Error(`Failed to fetch meals: ${res.statusText}`);
            }

            const recordsFetched: MealRecord[] = await res.json();
            const mealsReturned: DateMeal[] = recordsFetched.map(
                (mealRecord: MealRecord) => {
                    const date = mealRecord.date.split("T")[0];
                    const mealName = mealRecord.meal_name;
                    return {
                        date,
                        meal: {
                            name: mealName,
                        },
                    };
                }
            );
            setMeals(mealsReturned);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === "string") {
                setError(err);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [selectedWeekNum, selectedYear, weeksToShow]);

    return {
        meals,
        loading,
        error,
        fetchMeals,
    };
}

export default useMeals;
