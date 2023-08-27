const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


const yourTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const accessBtn = document.querySelector("[data-grantAccess]");
const input = document.querySelector('[data-searchInput]')
const submitbtn = document.querySelector('#submitbtn')
const loader = document.querySelector('.loading-container')
const formContainer = document.querySelector(".form-container");

const weatherInfoContainer = document.querySelector(".user-info-container");
const grantContainer = document.querySelector(".grant-location-container");

yourTab.classList.add('current-tab')
checkStorage()

yourTab.addEventListener("click", function () {
  searchTab.classList.remove('current-tab');
  formContainer.classList.remove('active');
  weatherInfoContainer.classList.remove('active');

  yourTab.classList.add('current-tab')

  checkStorage();
});


function checkStorage(){
  const cordinates = sessionStorage.getItem('cords');
  console.log(cordinates);
  if(!cordinates){
    grantContainer.classList.add('active');
  }else{
    const getcords = JSON.parse(cordinates);

    apiCall(getcords);
  }
}

async function apiCall(getcords){
  grantContainer.classList.remove('active');
  loader.classList.add('active')

  const lat = getcords.lat;
  const lon = getcords.lon;

  const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      loader.classList.remove('active');
      weatherInfoContainer.classList.add('active')
      showData(data);
}

function showData(weatherInfo) {
  //fistly, we have to fethc the elements 

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");


  //fetch values from weatherINfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

accessBtn.addEventListener('click', function(){
  navigator.geolocation.getCurrentPosition(showPosition);
});

function showPosition(position) {

  const Cordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  }

  sessionStorage.setItem("cords", JSON.stringify(Cordinates));
  apiCall(Cordinates);
 
}



searchTab.addEventListener('click', function(){
  yourTab.classList.remove('current-tab');
  grantContainer.classList.remove('active');
  weatherInfoContainer.classList.remove('active');
  searchTab.classList.add('current-tab');
  formContainer.classList.add('active')

});

formContainer.addEventListener('submit', function(e){
  e.preventDefault();
  const city = input.value
  if(city){
    cityApiCall(city);
  }
})


async function cityApiCall(city){
  loader.classList.add('active')
  const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();
    loader.classList.remove('active')
    weatherInfoContainer.classList.add('active')
    showData(data)
}
