import "./DarkModeButton.css";
import { useDarkMode } from "../context/DarkModeContext";
export const DarkModeButton = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    return (
        <>
            <button
                className={`toggle-button ${darkMode ? "dark" : ""}`}
                onClick={toggleDarkMode}
            >
                <div className={`toggle-circle ${darkMode}`}></div>
                <div className="button-decoration"></div>
            </button>
        </>
    );
};
