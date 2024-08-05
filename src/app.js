// Function to load data from the given URL
async function loadData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Checking the HTTP status code
            console.error('HTTP Error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);

        // Handling specific fetch errors
        if (error instanceof TypeError) {
            console.error('It seems like a network issue:', error.message);
        }
    }
}

// Function to process and log the fetched data
function processData(data) {
    console.log(data);
    return data;
}

// Async function to fetch weather data for a specific location
const fetchLocationWeather = async (location) => {
    if (!location) {
        console.error('No location specified.');
        return null;
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=2XP3ZHG7DX4NGCGKVHDRY2NK8&contentType=json`;

    try {
        const response = await fetch(url, { method: 'GET' });

        // Handle potential HTTP errors
        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function setupWeatherBtn () {
    document.getElementById('weatherForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const locationInput = document.getElementById('locationInput').value;
        const data = await fetchLocationWeather(locationInput);
        console.log(data);
    });
}


// load data
setupWeatherBtn();

