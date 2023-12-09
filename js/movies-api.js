import OMDB_API_KEY from "./keys.js"

let urlBase = `http://localhost:3000`;

export async function getOmdbDataByTitle(title) {
    try {
        const omdbUrl = 'http://www.omdbapi.com/?t=' + title + '&apikey=' + OMDB_API_KEY;
        const omdbResponse = await fetch(omdbUrl);
        return await omdbResponse.json();
    } catch (error) {
        console.log(error);
        return {};
    }
}

export async function getOmdbDataById(id) {
    try {
        const omdbUrl = 'http://www.omdbapi.com/?i=' + id + '&apikey=' + OMDB_API_KEY;
        const omdbResponse = await fetch(omdbUrl);
        return await omdbResponse.json();
    } catch (error) {
        console.log(error);
        return {};
    }
}

export async function getAllMovies() {
    try {
        const moviesUrl = `${urlBase}/movies`;
        const moviesResponse = await fetch(moviesUrl);
        return await moviesResponse.json();
    } catch (error) {
        console.log(error);
        throw new Error("Database failed to retrieve movies!")
    }
}

export async function createMovie(movie) {
    try {
        const url = `${urlBase}/movies`;
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
        console.log(error);
        return {};
    }
}

export async function updateMovieById(id, movie) {
    try {
        const url = `${urlBase}/movies/${id}`;
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        };
        const resp = await fetch(url, options);
        return await resp.json();
    } catch (error) {
        console.log(error);
        return {};
    }
}

export async function getMovieById(id) {
    try {
        const moviesUrl = `${urlBase}/movies/${id}`;
        const moviesResponse = await fetch(moviesUrl);
        return await moviesResponse.json();
    } catch (error) {
        console.log(error);
        return {};
    }
}

export async function deleteMovieById(id) {
    try {
        const url = `${urlBase}/movies/${id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.log(error);
        return {};
    }
}