const themeBtn = document.getElementById("themeBtn");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");
const result = document.getElementById("result");
const weatherIcon = document.getElementById("weatherIcon");
const suggestions = document.getElementById("suggestions");



themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️ حالت روز";
    }else{
        themeBtn.innerHTML = "🌙 حالت شب";
    }

});

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;

    if (city === "") {
        result.innerHTML = "<p>لطفاً نام شهر را وارد کنید.</p>";
        return;
    }

result.innerHTML = 
    `<h2>${city}</h2>
    <p>در حال دریافت اطلاعات آب‌وهوا...</p>`
;
});
async function getWeather(city) {

    

    const url =  'https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m';
    try {

        const response = await fetch(url);

        const data = await response.json();
        const weatherCode = data.current.weather_code;
        let icon = "🌤️";

        if (weatherCode === 0) { icon = "☀️";}
         else if ([1,2,3].includes(weatherCode)) {icon = "☁️";}
         else if ([51,53,55,61,63,65,80,81,82].includes(weatherCode)) { icon = "🌧️";}
         else if ([71,73,75,77,85,86].includes(weatherCode)) {icon = "❄️";}
    


        document.body.classList.remove("sunny", "cloudy", "rainy", "snow");

        if (weatherCode === 0) {
            document.body.classList.add("sunny");
        } else if ([1, 2, 3].includes(weatherCode)) {
            document.body.classList.add("cloudy");
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
            document.body.classList.add("rainy");
        } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
            document.body.classList.add("snow");
        }


        if (data.cod != 200) {
            result.innerHTML = "<p>شهر پیدا نشد.</p>";
            return;
        }

        result.innerHTML = `
        <div id="weatherIcon">${icon}</div>
            <h2>${data.name}</h2>
            <h1>${data.main.temp}°C</h1>
            <p>${data.weather[0].description}</p>
            <p>💧 رطوبت: ${data.main.humidity}%</p>
            <p>💨 سرعت باد: ${data.wind.speed} m/s</p>
        `;

    } catch (error) {
        result.innerHTML = "<p>خطا در دریافت اطلاعات.</p>";
        console.log(error);
    }
}
cityInput.addEventListener("input", async () => {
    console.log('در حال جستجو شهر')

    const city = cityInput.value.trim();

    if(city.length < 2){
        suggestions.innerHTML = "";
        return;
    }

    const response = await fetch(
        'https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5' );
   

    const data = await response.json();

    suggestions.innerHTML = "";

    if(!data.results) return;

    data.results.forEach(item=>{

        const li=document.createElement("li");

        li.innerHTML=`${item.name} ${item.country}`;

        li.onclick=()=>{

            cityInput.value=item.name;

            suggestions.innerHTML="";

            getWeather(item.name);

        }

        suggestions.appendChild(li);

    });

});
