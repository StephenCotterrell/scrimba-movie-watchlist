const emptyState = document.querySelector('.empty-state')
const searchResults = document.querySelector('.search-results')
const movieMap = {}

async function getSavedMovies () {
    const stored = JSON.parse(localStorage.getItem('watchlist') || '[]')
    await renderMovies(stored)
    
}

async function renderMovies(movies) {
    emptyState.classList.toggle('hidden', movies.length > 0)
    searchResults.innerHTML = '';
    let html = '';
    movies.forEach(movie => {
        movieMap[movie.imdbID] = movie;
        html += `
            <div class="movie-card" data-id="${movie.imdbID}">
                <div class="movie-poster">
                    ${movie.Poster !== 'N/A' 
                        ? `<img src="${movie.Poster}" alt="${movie.Title}" onerror="this.style.visibility='hidden'"/>`
                        : ``
                    }
                </div>
                <div class="movie-details">
                    <div>
                        <h2>${movie.Title}</h2><p>⭐<strong>${movie.imdbRating}</strong></p>
                    </div>
                    <div>
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button class="watchlist-button remove">
                            <img src="./assets/removeicon.svg" class="icon"/>  
                            Watchlist
                        </button>
                    </div>
                    <div class="movie-plot">
                        <p>${movie.Plot}</p>
                    </div>
                </div>
            </div>
            <div class='divider'>
            </div>
        `
    })
    searchResults.innerHTML = html;
}

getSavedMovies()

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove')) {
        const card = e.target.closest('.movie-card')
        const imdbID = card.dataset.id
        const movie = movieMap[imdbID]

        if (movie) {
            const stored = JSON.parse(localStorage.getItem('watchlist'))
            const updated = stored.filter(movie => movie.imdbID != imdbID)
            localStorage.setItem('watchlist', JSON.stringify(updated))
            renderMovies(updated)
            card.remove()
        }
        
    }
})
