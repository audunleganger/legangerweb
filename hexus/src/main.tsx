import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import SongPage from "./pages/SongPage.tsx";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";

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
