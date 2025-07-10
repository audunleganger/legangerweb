import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import SongPage from "./pages/SongPage.tsx";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";

if (
    localStorage.getItem("darkMode") === "true" &&
    !document.body.classList.contains("dark-mode")
) {
    document.body.classList.add("dark-mode-no-transition");
    document.body.classList.add("dark-mode");
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <DarkModeProvider>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/songs/:songId" element={<SongPage />} />
                </Routes>
            </DarkModeProvider>
        </BrowserRouter>
    </StrictMode>
);
