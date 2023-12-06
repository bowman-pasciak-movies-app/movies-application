//movies-api.js
export async function getAllMovies() {
    try {
        // Get all the movies
        const moviesUrl = 'http://localhost:3000/movies';
        const moviesResponse = await fetch(moviesUrl);

        // Return the movies array
        return await moviesResponse.json();
    } catch (error) {
        console.error(error);
    }
}

export async function createMovie(movie) {
    try {
        const url = `http://localhost:3000/movies`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movie)
        };
        const resp = await fetch(url, options);
        return await resp.json();
    } catch (error) {
        console.error(error);
    }
}
