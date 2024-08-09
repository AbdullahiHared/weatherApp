// Function to load data from the given URL
async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
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

// Setup event listener for the weather button
function setupWeatherBtn() {
    const form = document.getElementById('weatherForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const locationInput = document.getElementById('locationInput').value;
            loading();
            const data = await fetchLocationWeather(locationInput);
            console.log(data);
            if (data) {
                displayData(data);
            }
            stopLoading();
        });
    } else {
        console.error('Weather form not found.');
    }
}

// Load data
setupWeatherBtn();

// Function to get the day name from a date string
function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function displayData(data) {
    if (!data) return;
    getCurrentCity(data);
    createDayElements(data);
    createTimeElements(data);

    const currentTemp = document.querySelector('.currentTemp');
    if (currentTemp) {
        currentTemp.textContent = data.currentConditions.temp + '°C';
    } else {
        console.error('Current temperature element not found.');
    }
}

// Function to display the first five days forecast data
function createDayElements(data) {
    const daysForecastContainer = document.querySelector('.daysForecast');
    if (!daysForecastContainer) {
        console.error('Days forecast container not found.');
        return;
    }

    daysForecastContainer.innerHTML = ''; // Clear previous forecast
    const description = document.createElement('p');
    description.textContent = 'The Next Days Forecast ';
    daysForecastContainer.appendChild(description);
    description.classList.add('description');

    data.days.slice(0, 5).forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        const currentCondition = document.createElement('div');
        currentCondition.classList.add('currentCondition');

        const dayInfo = document.createElement('div');
        dayInfo.classList.add('dayInfo');

        const dayName = getDayName(day.datetime);
        const dateText = document.createElement('p');
        dateText.textContent = `${dayName}, ${new Date(day.datetime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
        dateText.classList.add('date');

        const conditionInfo = document.createElement('p');
        conditionInfo.textContent = day.conditions;
        dayInfo.appendChild(conditionInfo);
        dayInfo.appendChild(dateText);

        const conditionImg = document.createElement('img');
        conditionImg.classList.add('condition');
        getIcon(day.conditions, conditionImg);
        console.log(day.conditions);
        currentCondition.appendChild(conditionImg);


        const temp = document.createElement('div');
        temp.classList.add('temp');
        const maxTemp = document.createElement('p');
        maxTemp.textContent = `${day.tempmax}°`;
        const minTemp = document.createElement('p');
        minTemp.textContent = `${day.tempmin}°`;
        temp.appendChild(maxTemp);
        temp.appendChild(minTemp);

        dayInfo.appendChild(dateText);

        dayElement.appendChild(currentCondition);
        dayElement.appendChild(dayInfo);
        dayElement.appendChild(temp);

        daysForecastContainer.appendChild(dayElement);
    });
}

// Function to display the hourly forecast data
function createTimeElements(data) {
    const todaysWeatherContainer = document.querySelector('.todaysWeather');

    // Check if the weather container exists
    if (!todaysWeatherContainer) {
        console.error('Today\'s weather container not found.');
        return;
    }

    // Clear previous forecast
    todaysWeatherContainer.innerHTML = '';

    // Check if data is structured correctly
    if (!data.days || !data.days[0] || !Array.isArray(data.days[0].hours)) {
        console.error('Invalid data structure:', data);
        return;
    }

    // Iterate through the hours data
    data.days[0].hours.forEach(hour => {
        // Create a new div element for each hour
        const hourElement = document.createElement('div');
        hourElement.classList.add('hour');

        // Create and set up the condition image
        const conditionImg = document.createElement('img');
        conditionImg.classList.add('condition');
        getIcon(hour.conditions, conditionImg); // Ensure getIcon function is defined elsewhere

        // Create and set up the hour time element
        const hourTime = document.createElement('p');
        hourTime.classList.add('hour-time');

        // Ensure hour.datetime exists
        if (hour.datetime) {
             console.log(hour.datetime.split('T')[1].split(':')[0] + 'h');
            hourTime.textContent = hour.datetime;
        } else {
            console.warn('Hour time not found for hour:', hour);
            hourTime.textContent = 'Unknown Time';
        }

        // Create and set up the temperature element
        const temp = document.createElement('p');
        temp.classList.add('hour-temp');
        temp.textContent = `${hour.temp}°C`;

        // Append elements to the hour container
        hourElement.appendChild(conditionImg);
        hourElement.appendChild(hourTime);
        hourElement.appendChild(temp);

        // Append the hour container to the weather container
        todaysWeatherContainer.appendChild(hourElement);
    });
}


// Function to retrieve current city
function getCurrentCity(data) {
    const cityName = document.querySelector('.currentCity');
    if (cityName) {
        cityName.textContent = data.address;
    } else {
        console.error('Current city element not found.');
    }
}

// Loading animation
function loading() {
    const loading = document.querySelector('.btn.btn-primary');
    if (loading) {
        loading.style.display = 'block';
    } else {
        console.error('Loading element not found.');
    }
}

// Stop loading animation
function stopLoading() {
    const loading = document.querySelector('.btn.btn-primary');
    if (loading) {
        loading.style.display = 'none';
    } else {
        console.error('Loading element not found.');
    }
}

function getIcon(condition, img) {
    switch (condition.toLowerCase()) { // Convert condition to lowercase for consistent comparison
        case 'clear':
        case 'sunny':
            img.src = 'assets/sunny.svg';
            break;
        case 'partially cloudy':
        case 'clouds':
        case 'mostly cloudy':
            img.src = 'assets/cloudy.svg';
            break;
        case  'Rain, overcast' :
        case 'Rain, partially cloudy' :
        case 'overcast':
        case 'rain':
        case 'light rain':
        case 'heavy rain':
        case 'showers':
        case 'thunderstorms':
            img.src = 'assets/rainy.svg';
            break;
        case 'snow':
        case 'flurries':
        case 'sleet':
        case 'blizzard':
            img.src = 'assets/snow.svg';
            break;
        case 'fog':
        case 'mist':
        case 'haze':
            img.src = 'assets/fog.svg';
            break;
        default:
            img.src = 'assets/rainy.svg';
            console.warn(`Unhandled weather condition: ${condition}`);
            break;
    }
}


async  function getGif(condition, img) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=hlffvLB88mltPEeZlVynq25EmLU1dSLv&s=${condition}`, { mode: 'cors' });
        const data = await response.json();
        img.src = data.data.images.original.url;
    } catch (error) {
        console.log('Error: ', error);
        console.log('status' + request.status)
    }
}

