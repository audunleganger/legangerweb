import { useEffect, useState } from "react";
import "./App.css";
import useMeals from "./hooks/useMeals";
import { useWeekNavigation } from "./hooks/useWeekNavigation";
import { MealTable } from "./components/mealTable";
import LoginForm from "./components/loginForm";

function App() {
    const [weeksToShow, setWeeksToShow] = useState(2);
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("accessToken")
    );
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
            <h1>Matmeny</h1>
            <h4>År: {selectedYear}</h4>
            <section className="nav-buttons">
                <button onClick={goToPrevWeek}>Forrige</button>
                <button onClick={goToNextWeek}>Neste</button>
            </section>
            <MealTable
                meals={meals}
                weeksToShow={weeksToShow}
                selectedWeekNum={selectedWeekNum}
                selectedYear={selectedYear}
                fetchMeals={fetchMeals}
                loggedInStatus={isLoggedIn}
            />
            <div style={{ minHeight: "2em" }}>
                {loading && <p>Henter måltider...</p>}
                {error && <p className="error">{error}</p>}
            </div>
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
            {!isLoggedIn ? (
                <LoginForm onLogin={() => setIsLoggedIn(true)} />
            ) : (
                <button
                    className="logout-button"
                    onClick={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        setIsLoggedIn(false);
                    }}
                >
                    Logg ut
                </button>
            )}
        </>
    );
}

export default App;
