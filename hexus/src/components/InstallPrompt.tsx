import { useInstallPrompt } from "../hooks/usePwaInstall";

const InstallPrompt = () => {
    const { isPromptSupported, promptInstall } = useInstallPrompt();

    if (!isPromptSupported) {
        return null;
    }

    return (
        <div className="install-prompt">
            <button onClick={promptInstall} className="install-button">
                Install App
            </button>
        </div>
    );
};

export default InstallPrompt;
