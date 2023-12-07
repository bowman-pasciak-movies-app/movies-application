//movies-api.js

import OMDB_API_KEY from "./keys.js"

export async function getOmdbDataByTitle(title) {
    try {
        // Get all the movies
        const omdbUrl = 'http://www.omdbapi.com/?t=' + title + '&apikey=' + OMDB_API_KEY;
        const omdbResponse = await fetch(omdbUrl);

        // Return the movies array
        return await omdbResponse.json();
    } catch (error) {
        return null;
    }
}

export async function getOmdbDataById(id) {
    try {
        // Get all the movies
        const omdbUrl = 'http://www.omdbapi.com/?i=' + id + '&apikey=' + OMDB_API_KEY;
        const omdbResponse = await fetch(omdbUrl);

        // Return the movies array
        return await omdbResponse.json();
    } catch (error) {
        return null;
    }
}

export async function getAllMovies() {
    try {
        // Get all the movies
        const moviesUrl = 'http://localhost:3000/movies';
        const moviesResponse = await fetch(moviesUrl);

        // Return the movies array
        return await moviesResponse.json();
    } catch (error) {
        throw new Error("Database failed to retrieve movies!")
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

export async function updateMovieById(id, movie) {
    try {
        const url = `http://localhost:3000/movies/${id}`;
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
        console.error(error);
    }
}

export async function getMovieById(id) {
    try {
        // Get all the movies
        const moviesUrl = `http://localhost:3000/movies/${id}`;
        const moviesResponse = await fetch(moviesUrl);

        // Return the movies array
        return await moviesResponse.json();
    } catch (error) {
        console.error(error);
    }
}

export async function deleteMovieById(id) {
    try {
        const url = `http://localhost:3000/movies/${id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}