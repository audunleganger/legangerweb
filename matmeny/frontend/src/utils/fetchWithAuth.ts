export const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {}
) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const headers = {
        ...(init.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    let response = await fetch(input, { ...init, headers });

    // If unauthorized and refresh token is available, try to refresh
    if (response.status === 401 && refreshToken) {
        const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
            const { accessToken: newToken } = await refreshRes.json();
            localStorage.setItem("accessToken", newToken);
            const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(input, { ...init, headers: retryHeaders });
        } else {
            // If refresh fails, clear tokens, log out user
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.reload();
            throw new Error("Session expired, please log in again.");
        }
    }

    return response;
};
