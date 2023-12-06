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