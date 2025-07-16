const searchForm = document.getElementById("search-form")
const searchResults = document.querySelector(".search-results")
const emptyState = document.querySelector(".empty-state")
const movieMap = {}
const apikey = import.meta.env.VITE_OMDB_API_KEY

async function getMovieSearch(searchTerm) { 
    const query = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${apikey}`
    const res = await fetch(query)
    const data = await res.json()
    const searchResults = data.Search

    return searchResults
}

async function getMovieDetails(imdbID) {
    const query = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apikey}`
    const res = await fetch(query)
    const data = await res.json()
    return data
}

async function getMovieList(searchTerm) {
    const searchResults = await getMovieSearch(searchTerm)
    const movieList = await Promise.all(
        searchResults.map(result => getMovieDetails(result.imdbID))
    )
    return movieList
}

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form);
    const searchTerm = formData.get("search")

    if (searchTerm) {
        try {
            const results = await getMovieList(searchTerm)
            renderMovies(results)
        } catch (err) {
            console.error("Error during search", err)
        }
    }

})

async function renderMovies(movies) {
    emptyState.classList.add('hidden');
    searchResults.innerHTML = '';
    let html = '';
    console.log(movies)
    const stored = JSON.parse(localStorage.getItem('watchlist') || '[]')
    const storedIds = new Set(stored.map(m => m.imdbID))
    movies.forEach(movie => {
        movieMap[movie.imdbID] = movie;
        const isInWatchList = storedIds.has(movie.imdbID)
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
                        <button class="${isInWatchList ? 'remove': 'add'} watchlist-button">
                            <img class="icon" src="./assets/${isInWatchList ? 'remove' : 'add'}icon.svg" alt=""/>  
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
}

function updateWatchlistButton(button, isAdded) {
    button.classList.toggle('add', isAdded)
    button.classList.toggle('remove', !isAdded)
    let icon = button.querySelector('img.icon')
    icon.src = isAdded ? './assets/removeicon.svg' : './assets/addicon.svg'
    icon.alt = isAdded ? 'Remove from watchlist' : 'Add to watchlist'
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('watchlist-button')) {
        const card = e.target.closest('.movie-card')
        const button = e.target.closest('.watchlist-button')
        if (!button) return
        const imdbID = card.dataset.id
        const movie = movieMap[imdbID]
        let stored = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const storedIds = new Set(stored.map(m => m.imdbID))
        const isAdded = storedIds.has(imdbID)
        if (isAdded) {
            stored = stored.filter(m => m.imdbID !== imdbID)
        } else {
            stored.push(movie)
        }
        localStorage.setItem('watchlist', JSON.stringify(stored))
        updateWatchlistButton(button, !isAdded)
    }
})