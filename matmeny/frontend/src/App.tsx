import { useEffect, useState } from "react";
import "./App.css";
import useMeals from "./hooks/useMeals";
import { useWeekNavigation } from "./hooks/useWeekNavigation";
import { MealTable } from "./components/mealTable";

function App() {
    const [weeksToShow, setWeeksToShow] = useState(2);
    const { selectedWeekNum, selectedYear, goToPrevWeek, goToNextWeek } =
        useWeekNavigation();

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

    return (
        <>
            <h1>År: {selectedYear}</h1>
            <button onClick={goToPrevWeek}>Forrige</button>
            <button onClick={goToNextWeek}>Neste</button>
            {loading ? (
                <h1>Loading</h1>
            ) : (
                <MealTable
                    meals={meals}
                    weeksToShow={weeksToShow}
                    selectedWeekNum={selectedWeekNum}
                    selectedYear={selectedYear}
                    fetchMeals={fetchMeals}
                />
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
