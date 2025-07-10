import { useDarkMode } from "../context/DarkModeContext";
import "./Footer.css";
export const Footer = () => {
    const { darkMode } = useDarkMode();
    return (
        <section className={`footer ${darkMode ? "dark-mode" : ""}`}>
            <p>
                Online-portalen til Hexus er utarbeidet av Audun Leganger etter
                forespørsel fra Henrik Cornelius Løvenørn.{" "}
            </p>
            <p>Innholdet er basert på 2018-utgaven av sangboken.</p>
        </section>
    );
};
