const searchForm = document.getElementById("search-form")
const searchResults = document.querySelector(".search-results")
const emptyState = document.querySelector(".empty-state")
const movieMap = {}

async function getMovieSearch(searchTerm) { 
    const query = `http://www.omdbapi.com/?s=${searchTerm}&apikey=[REDACTED]`
    const res = await fetch(query)
    const data = await res.json()
    const searchResults = data.Search

    return searchResults
}

async function getMovieDetails(imdbID) {
    const query = `http://www.omdbapi.com/?i=${imdbID}&apikey=[REDACTED]`
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
                            <img src="./assets/addicon.svg" class="add-icon"/>  
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

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-watchlist')) {
        const card = e.target.closest('.movie-card')
        const imdbID = card.dataset.id
        const movie = movieMap[imdbID]

        if (movie) {
            const stored = JSON.parse(localStorage.getItem('watchlist') || '[]');
            stored.push(movie)
            localStorage.setItem('watchlist', JSON.stringify(stored))
        }
    }
})