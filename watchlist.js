const emptyState = document.querySelector('.empty-state')
const searchResults = document.querySelector('.search-results')
const movieMap = {}

async function getSavedMovies () {
    const stored = JSON.parse(localStorage.getItem('watchlist') || '[]')
    console.log(stored)
    await renderMovies(stored)
    
}


async function renderMovies(movies) {
    emptyState.classList.add('hidden');
    searchResults.innerHTML = '';
    let html = '';
    console.log(movies)
    movies.forEach(movie => {
        movieMap[movie.imdbID] = movie;
        html += `
            <div class="movie-card" data-id="${movie.imdbID}">
                <div class="movie-poster">
                    <img src="${movie.Poster}" alt="${movie.Title} poster"/>
                </div>
                <div class="movie-details">
                    <div>
                        <h2>${movie.Title}</h2><p>⭐<strong>${movie.imdbRating}</strong></p>
                    </div>
                    <div>
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button class="add-to-watchlist">
                            <img src="./assets/removeicon.svg" class="add-icon"/>  
                            Watchlist
                        </button>
                    </div>
                    <div class="movie-plot">
                        <p>${movie.Plot}</p>
                    </div>
                </div>
            </div>
        `
    })
    searchResults.innerHTML = html;
    console.log(movieMap)
}

getSavedMovies()
