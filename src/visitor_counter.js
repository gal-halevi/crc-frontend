const visitorCount = 'visitorCount'

document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById(visitorCount);
    const cachedCount = localStorage.getItem(visitorCount);
    if (cachedCount !== null) {
        counterElement.textContent = cachedCount;
    } else {
        counterElement.textContent = 'Loading...';
    }
    updateCounter(counterElement);
});

async function updateCounter(counterElement) {
    try {
        config = await getConfig()
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'tableName': config.tableName,
                'primaryKey': config.primaryKey
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const newCount = data.visitorCount;

        counterElement.textContent = newCount;
        localStorage.setItem(visitorCount, newCount);
    } catch (error) {
        console.error("Error updating counter:", error);
    }
}

async function getConfig() {
    const configResponse = await fetch('config.json');
    if (!configResponse.ok) {
      throw new Error(`Failed to load config.json: ${configResponse.status}`);
    }
    const config = await configResponse.json();
    return config
}
