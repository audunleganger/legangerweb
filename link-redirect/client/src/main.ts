interface LinkResponse {
    index: string;
    url: string;
}

console.log("Script loaded");

const fetchHealth = async () => {
    try {
        const response = await fetch("/api/health");
        console.log("Health check response status:", response.status);
        console.log("Health check response body:", await response.text());
    } catch (error) {
        console.error("Health check error:", error);
    }
};

// Store link and index in localstorage
const storeDataInLocalstorage = (indexToStore: string, linkToStore: string) => {
    localStorage.setItem("linkIndex", indexToStore.toString());
    localStorage.setItem("linkURL", linkToStore);
};

// Retrieve index and link from localstorage
const retrieveDataFromLocalstorage = (): {
    index: string;
    link: string;
} | null => {
    const index = localStorage.getItem("linkIndex");
    const link = localStorage.getItem("linkURL");
    if (index && link) {
        return { index, link };
    } else {
        return { index: "", link: "" };
    }
};

const getValidatedData = async (
    indexToValidate: string | undefined,
    linkToValidate: string | undefined
) => {
    if (!indexToValidate || !linkToValidate) {
        indexToValidate = "-1";
        linkToValidate = "";
    }
    try {
        const response = await fetch("/api/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                index: indexToValidate,
                link: linkToValidate,
            }),
        });
        const data = await response.json();
        return data;
    } catch {
        console.error("Error validating data");
        return null;
    }
};

// fetchHealth();
// const button = document.querySelector("button");
// button?.addEventListener("click", fetchNewLink);

// Flow
// 1. Check localstorage for existing link and index
// 2. Send stored data to server
// 3. Server validates, returns the redirect endpoint (same if existing tuple is valid)
// 4. Store new data in localstorage
// 5. Redirect user to the link

const runFlow = async () => {
    const storedData = retrieveDataFromLocalstorage();
    const storedIndex = storedData?.index;
    const storedLink = storedData?.link;
    const validatedData = await getValidatedData(storedIndex, storedLink);
    const validatedIndex = validatedData?.index;
    const validatedLink = validatedData?.link;

    if (validatedIndex && validatedLink) {
        storeDataInLocalstorage(validatedIndex.toString(), validatedLink);
    }

    window.location.href = validatedLink;
};

runFlow();
