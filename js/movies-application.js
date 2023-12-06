"use strict";

import {getAllMovies, createMovie} from "./movies-api.js";

(async () => {

    function renderMovie(movie) {
        let template = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${movie.rating}</p>
                <p class="card-text">${movie.movieSummary}</p>
            </div>
        </div>`;
        return template;
    }

    function renderMovies(allMovies) {
        let elementHTML = "";
        for (let i = 0; i < allMovies.length; i++) {
            elementHTML += renderMovie(allMovies[i]);

        }
        document.querySelector("#rendered-movies").innerHTML = elementHTML;
    }


    let allMovies = await getAllMovies();
    renderMovies(allMovies);



})();
