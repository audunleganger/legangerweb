async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Unknown error");
    }
    return data as T;
}

const getDifficulty = async (): Promise<string> => {
    const data = await apiFetch<{ difficulty: string }>("/api/difficulty");
    return data.difficulty;
};

const postDifficulty = async (difficulty: string): Promise<string> => {
    const data = await apiFetch<{ message: string }>("/api/difficulty", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
    });
    return data.message;
};

const getTime = async (): Promise<string> => {
    const data = await apiFetch<{ time: string }>("/api/time");
    return data.time;
};

const postTime = async (time: string): Promise<string> => {
    const data = await apiFetch<{ message: string }>("/api/time", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: { time } }),
    });
    return data.message;
};

const getGameMode = async (playerName: string): Promise<string> => {
    const data = await apiFetch<{ gamemode: string }>(
        `/api/gamemode?playerName=${encodeURIComponent(playerName)}`
    );
    return data.gamemode;
};

const postGameMode = async (
    playerName: string,
    gamemode: string
): Promise<string> => {
    const data = await apiFetch<{ message: string }>("/api/gamemode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            playerName: playerName,
            gamemode: gamemode,
        }),
    });
    return data.message;
};

const sendCommand = async (command: string) => {
    const response = await fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: `${command}` }),
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
    }
};

export {
    getDifficulty,
    postDifficulty,
    getTime,
    postTime,
    getGameMode,
    postGameMode,
};
