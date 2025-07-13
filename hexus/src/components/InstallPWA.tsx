/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

const InstallPWA = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] =
        useState<BeforeInstallPromptEvent | null>(null);

    // Type for BeforeInstallPromptEvent
    interface BeforeInstallPromptEvent extends Event {
        prompt: () => Promise<void>;
        userChoice: Promise<{
            outcome: "accepted" | "dismissed";
            platform: string;
        }>;
    }

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            const beforeInstallPromptEvent =
                e as unknown as BeforeInstallPromptEvent;
            console.log("we are being triggered :D");
            setSupportsPWA(true);
            setPromptInstall(beforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const onClick = (evt: any) => {
        evt.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
    };
    if (!supportsPWA) {
        return null;
    }
    return (
        <button
            className="link-button"
            id="setup_button"
            aria-label="Install app"
            title="Install app"
            onClick={onClick}
        >
            Install
        </button>
    );
};

export default InstallPWA;
