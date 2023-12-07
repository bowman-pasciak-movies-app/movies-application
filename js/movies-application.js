"use strict";

import {getAllMovies, createMovie, updateMovie, getMovieById} from "./movies-api.js";

(() => {

    let moviesContainerElement = document.querySelector("#rendered-movies");

    let addMovieForm = document.querySelector("#add-movie-form");

    addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addMovie();
    });

    function addMovie() {
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim()
        };
        createMovie(movie)
            .then(() => {
                resetMovieForm();
                updateShownMovies();
            });
    }

    function updateShownMovies() {
        moviesContainerElement.innerHTML = "<h1 class=`loading`>Loading...</h1>";
        getAllMovies()
            .then((allMovies) => {
                renderMovies(allMovies);
            });
    }

    function resetMovieForm() {
        addMovieForm.reset();
    }

    function onEditMovie(id) {
        document.getElementById("id").value = id;
        getMovieById(id)
            .then((selectedMovie) => {
                document.getElementById("title").value = selectedMovie.title;
                document.getElementById("rating").value = selectedMovie.rating;
                document.getElementById("movieSummary").value = selectedMovie.movieSummary;
                document.getElementById("formButton").innerText = "Save Changes";
            });
    }

    function renderMovie(movie) {

        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardTitle = document.createElement("h5");
        let cardRating = document.createElement("p");
        let cardSummary = document.createElement("p");
        let editMovieBtn = document.createElement("button");

        card.classList.add("card");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title");
        cardRating.classList.add("card-text");
        cardSummary.classList.add("card-text");
        editMovieBtn.classList.add("btn");

        cardTitle.innerText = movie.title;
        cardRating.innerText = movie.rating;
        cardSummary.innerText = movie.movieSummary;
        editMovieBtn.innerText = "Edit";

        editMovieBtn.addEventListener("click", (e) => {
            onEditMovie(movie.id);
        })

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardRating)
        cardBody.appendChild(cardSummary)
        cardBody.appendChild(cardBtn)
        card.appendChild(cardBody);

        return card;
    }

    function renderMovies(allMovies) {
        moviesContainerElement.innerHTML = "";
        for (let i = 0; i < allMovies.length; i++) {
            moviesContainerElement.appendChild(renderMovie(allMovies[i]));
        }

    }

    updateShownMovies();

})();
