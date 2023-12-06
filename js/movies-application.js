"use strict";

import {getAllMovies, createMovie} from "./movies-api.js";

(async () => {

    let moviesContainerElement = document.querySelector("#rendered-movies");

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
        moviesContainerElement.innerHTML = elementHTML;
    }

    async function pageLoad() {

        moviesContainerElement.innerHTML = "<h1 class=`loading`>Loading...</h1>";

        let allMovies = await getAllMovies();

        renderMovies(allMovies);


    }

    await pageLoad();



})();
