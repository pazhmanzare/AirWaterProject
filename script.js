const themeBtn = document.getElementById("themeBtn");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");
const result = document.getElementById("result");
const suggestions = document.getElementById("suggestions");
const forecast = document.getElementById("forecast");

// ==================== حالت شب و روز ====================

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = "☀️ حالت روز";
    } else {
        themeBtn.innerHTML = "🌙 حالت شب";
    }
});

// --------------------- دکمه جستجو ---------------------

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city===""){
        result.innerHTML="<p>نام شهر را وارد کنید.</p>";
        return;
    }

    getWeather(city);

});

// ------------------- دریافت مختصات شهر -----------------------

async function getWeather(city){

    try{

        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);

        const geoData = await geoResponse.json();

        if(!geoData.results){

            result.innerHTML="<p>شهر پیدا نشد.</p>";
            return;

        }

        const lat=geoData.results[0].latitude;
        const lon=geoData.results[0].longitude;

        getWeatherData(lat,lon,geoData.results[0].name);

    }catch(error){

        result.innerHTML="<p>خطا در دریافت اطلاعات.</p>";

    }

}

// ------------------ دریافت آب و هوا --------------------
async function getWeatherData(lat,lon,city){

    const response=await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
);

    const data=await response.json();

    const code=data.current.weather_code;

    let icon="🌤️";

    document.body.classList.remove("sunny","cloudy","rainy","snow");

    if(code===0){

        icon="☀️";
        document.body.classList.add("sunny");

    }else if([1,2,3].includes(code)){

        icon="☁️";
        document.body.classList.add("cloudy");

    }else if([51,53,55,61,63,65,80,81,82].includes(code)){

        icon="🌧️";
        document.body.classList.add("rainy");

    }else if([71,73,75,77,85,86].includes(code)){

        icon="❄️";
        document.body.classList.add("snow");

    }

    result.innerHTML=`

    <div id="weatherIcon">${icon}</div>

    <h2>${city}</h2>

    <h1>${data.current.temperature_2m}°C</h1>

    <p>💧 رطوبت: ${data.current.relative_humidity_2m}%</p>

    <p>💨 سرعت باد: ${data.current.wind_speed_10m} km/h</p>

    `;

}

// --------------- پیشنهاد شهرها ---------------------

cityInput.addEventListener("input",async()=>{

    const city=cityInput.value.trim();

    if(city.length<2){

        suggestions.innerHTML="";
        return;

    }

    const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5`);

    const data=await response.json();

    suggestions.innerHTML="";

    if(!data.results) return;

    data.results.forEach(item=>{

        const li=document.createElement("li");

        li.innerHTML=`${item.name}, ${item.country}`;

        li.onclick=()=>{

            cityInput.value=item.name;

            suggestions.innerHTML="";

            getWeather(item.name);

        };

        suggestions.appendChild(li);

    });

});
