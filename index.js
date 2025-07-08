async function getMovieList () { 
    const res = await fetch("http://www.omdbapi.com/?i=tt3896198&apikey=5802851")
    const data = await res.json()
    console.log(data)
}

getMoveList()