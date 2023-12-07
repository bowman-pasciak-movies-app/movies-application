"use strict";

import {getAllMovies, createMovie, updateMovieById, getMovieById, deleteMovieById} from "./movies-api.js";

(() => {

    let moviesContainerElement = document.querySelector("#rendered-movies");

    let addMovieForm = document.querySelector("#add-movie-form");

    addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (addMovieForm.id.value !== "") {
            updateMovie();
        } else {
            addMovie();
        }
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
            })
            .catch(() => {
                appendAlert('Could not add movie!', 'danger');
            })
    }

    function updateMovie() {
        let id = Number(addMovieForm.id.value);
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim()
        };
        updateMovieById(id, movie)
            .then(() => {
                resetMovieForm();
                updateShownMovies();
            })
            .catch(() => {
                appendAlert(`Could not update movie with id ${id}!`, 'danger');
            })
    }

    function updateShownMovies() {
        moviesContainerElement.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
        getAllMovies()
            .then((allMovies) => {
                renderMovies(allMovies);
            })
            .catch((error) => {
                moviesContainerElement.innerHTML = "<div>Error</div>"
                appendAlert(error.message, 'danger');
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
            })
            .catch(() => {
                appendAlert(`Could not get movie id# ${id}!`, 'danger');
            })
    }

    function onDeleteMovie(id) {
        id = Number(id);
        deleteMovieById(id)
            .then(() => {
                updateShownMovies();
            })
            .catch(() => {
                appendAlert(`Could not delete movie id# ${id}!`, 'danger');
            })
    }

    function generateMovieRating(rating) {
        let movieRatingHTML = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                movieRatingHTML += `<i class="bi bi-star-fill"></i>`;
            } else {
                movieRatingHTML += `<i class="bi bi-star"></i>`;
            }
        }
        return movieRatingHTML;
    }

    function renderMovie(movie) {

        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardTitle = document.createElement("h5");
        let cardRating = document.createElement("p");
        let cardSummary = document.createElement("p");
        let editMovieBtn = document.createElement("button");
        let deleteMovieBtn = document.createElement("button");

        card.classList.add("card" , "col-4", "m-1", "col-md-2");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title");
        cardRating.classList.add("card-text");
        cardSummary.classList.add("card-text");
        editMovieBtn.classList.add("btn");
        deleteMovieBtn.classList.add("btn");

        cardTitle.innerText = movie.title;
        cardRating.innerHTML = generateMovieRating(movie.rating);
        cardSummary.innerText = movie.movieSummary;
        editMovieBtn.innerText = "Edit";
        deleteMovieBtn.innerText = "Delete";

        editMovieBtn.addEventListener("click", (e) => {
            onEditMovie(movie.id);
        })
        deleteMovieBtn.addEventListener("click", (e) => {
            onDeleteMovie(movie.id);
        })


        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardRating);
        cardBody.appendChild(cardSummary);
        cardBody.appendChild(editMovieBtn);
        cardBody.appendChild(deleteMovieBtn);
        card.appendChild(cardBody);

        return card;
    }

    function renderMovies(allMovies) {
        moviesContainerElement.innerHTML = "";
        for (let i = 0; i < allMovies.length; i++) {
            moviesContainerElement.appendChild(renderMovie(allMovies[i]));
        }

    }

    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }


    updateShownMovies();

})();
