'use strict';

const inputCity = document.querySelector('.input-field-city');
const outputCities = document.querySelector('.output-cities');
const inputMovie = document.querySelector('.input-field-movie');
const outputMovies = document.querySelector('.output-movies');

const movies = document.querySelector('.movies');
const grid = document.querySelector('.grid');
const movie = document.querySelector('.movie');
const moviePoster = document.querySelector('.movie-poster');
const movieTitle = document.querySelector('.movie-title');

const options = {
  method: 'GET',
  headers: {'Content-Type': 'application/json; charset=UTF-8'},
  mode: 'cors'
}

const citiesURL = './assets/script/cities.json';

async function getCities() {
  try {
    const response = await fetch(citiesURL, options);
    
    if (!response.ok) {
      throw new Error(`${response.statusText} ${response.status}`);
    };
    
    const data = await response.json();
    const cities = data.cities.map(city => city.name);
    
    inputCity.addEventListener('input', () => {
      const inputValue = inputCity.value.toLowerCase();
      const filteredCities =
        cities.filter(city => city.toLowerCase().includes(inputValue));
      
      if (filteredCities.length === 0) {
        outputCities.style.color = '#000';
        outputCities.style.display = 'block';
        outputCities.innerHTML = 'city not found';
      } else if (inputValue.length === 0) {
        outputCities.style.display = 'none';
        outputCities.innerHTML = '';
      } else if (inputCity.value.length > 2) {
        outputCities.style.display = 'block';
       outputCities.innerHTML = '';
        
       filteredCities.forEach(city => {
         const div = document.createElement('div');
         div.classList.add('list');
         div.textContent = city;
         div.addEventListener('click', () => {
           inputCity.value = city;
           outputCities.innerHTML = '';
         });
         outputCities.appendChild(div);
       });
      };
    });
  } catch (error) {
    console.log(error.message);
  };
};

getCities();

const moviesURL = 'https://api.andrespecht.dev/movies';

async function getMovies() {
  try {
    const response = await fetch(moviesURL, options);
    
    if (!response.ok) {
      throw new Error(`${response.statusText} (${response.status})`);
    };
    
    const data = await response.json();
    const movies = data.response.map(movie => movie.title);
    
    for (let i = 0; i < 12; i++) {
      const movie = document.createElement('div');
      movie.classList.add('movie');
      grid.appendChild(movie);
      
      movies[6] = 'The Fellowship of the Ring';
      
      const moviePoster = document.createElement('div');
      moviePoster.style.backgroundImage =
        `url('https://raw.githubusercontent.com/mrspecht/media/main/img/${movies[i].toLowerCase().replace(/ /g, '-').replace(':', '').replace("'", "")}.jpg`;
      moviePoster.style.backgroundPosition = 'center';
      moviePoster.style.backgroundRepeat = 'no-repeat';
      moviePoster.style.backgroundSize = 'cover';
      moviePoster.classList.add('movie-poster');
      movie.appendChild(moviePoster);
      
      const movieTitle = document.createElement('div');
      movieTitle.innerHTML = movies[i];
      movieTitle.classList.add('movie-title');
      movie.appendChild(movieTitle);
    }
    
    inputMovie.addEventListener('input', () => {
      const inputValue = inputMovie.value.toLowerCase();
      const filteredMovies =
        movies.filter(movie => movie.toLowerCase().includes(inputValue));
      
      if (filteredMovies.length === 0) {
        outputMovies.style.color = '#000';
        outputMovies.style.display = 'block';
        outputMovies.innerHTML = 'movie not found';
      } else if (inputValue.length === 0) {
        outputMovies.style.display = 'none';
        outputMovies.innerHTML = '';
      } else if (inputMovie.value.length > 2) {
        outputMovies.style.display = 'block';
        outputMovies.innerHTML = '';
        
        filteredMovies.forEach(movie => {
          const div = document.createElement('div');
          div.classList.add('list');
          div.textContent = movie;
          div.addEventListener('click', () => {
            inputMovie.value = movie;
            outputMovies.innerHTML = '';
          });
          outputMovies.appendChild(div);
        });
      };
    });
  } catch(error) {
    console.log(error);
  }
};

getMovies();

mapboxgl.accessToken = 'pk.eyJ1IjoidGFtYW5jaGljaGFuIiwiYSI6ImNsZzEwamkwcjE0b20zcGxhdHk3b3Rnb2EifQ.WPkXz--D_pWcSZI2oMJBQQ';

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let requestUrl =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
    
      fetch(requestUrl)
      .then(response => response.json())
      .then(data => {
        let city = data.features[4].text;
        inputCity.value = city;
      })
      .catch(error => console.error(error));
  });
} else {
  console.log("Geolocation is not supported by this browser.");
};