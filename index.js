async function getMovieList() { 
    const res = await fetch("http://www.omdbapi.com/?i=tt3896198&apikey=[REDACTED]")
    const data = await res.json()
    console.log(data)
}

getMovieList()