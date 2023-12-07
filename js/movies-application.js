"use strict";

import {
    getAllMovies,
    createMovie,
    updateMovieById,
    getMovieById,
    deleteMovieById,
    getOmdbDataByTitle
} from "./movies-api.js";

(() => {

    let currentSortOrder = "title";

    let sortByTitleButton = document.querySelector("#sort-by-title");
    let sortByRatingButton = document.querySelector("#sort-by-rating");
    let sortByGenreButton = document.querySelector("#sort-by-genre");

    sortByTitleButton.addEventListener("click", function (e) {
        e.preventDefault();
        currentSortOrder = "title";
        updateShownMovies();
    });

    sortByRatingButton.addEventListener("click", function (e) {
        e.preventDefault();
        currentSortOrder = "rating";
        updateShownMovies();
    });

    sortByGenreButton.addEventListener("click", function (e) {
        e.preventDefault();
        currentSortOrder = "genre";
        updateShownMovies();
    });

    let moviesContainerElement = document.querySelector("#rendered-movies");

    let addMovieForm = document.querySelector("#add-movie-form");

    addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (addMovieForm.id.value !== "") {
            updateMovie()
                .then(() => {
                    appendAlert('Movie updated successfully!', 'success');
                })
        } else {
            addMovie()
                .then((result) => {
                    appendAlert('Movie added successfully!', 'success');
                })
        }
    });

    async function addMovie() {
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim(),
            genre: addMovieForm.genre.value.trim()
        };

        // this should be done on Add and on Update - need to add image property to dataset
        getOmdbDataByTitle(movie.title)
            .then((omdbResponse) => {
                if (!omdbResponse) {
                    movie.image = "images/defaultPoster.svg";
                } else {
                    movie.image = omdbResponse.Poster;
                }
                if (movie.image === "N/A" || !movie.image) {
                    console.log(movie.image);
                    movie.image = "images/defaultPoster.svg";
                }
                createMovie(movie)
                    .then(() => {
                        resetMovieForm();
                        updateShownMovies();
                    })
                    .catch(() => {
                        appendAlert('Could not add movie!', 'danger');
                    })
            })
    }

    function updateMovieJson(id, movie) {
        return updateMovieById(id, movie)
            .then(() => {
                resetMovieForm();
                updateShownMovies();
                return true;
            })
            .catch(() => {
                appendAlert(`Could not update movie with id ${id}!`, 'danger');
            })
    }

    function updateMovie() {
        let id = Number(addMovieForm.id.value);
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim(),
            genre: addMovieForm.genre.value.trim()
        };
        return getOmdbDataByTitle(movie.title)
            .then((omdbResponse) => {
                if (!omdbResponse) {
                    movie.image = "images/defaultPoster.svg";
                } else {
                    movie.image = omdbResponse.Poster;
                }
                if (movie.image === "N/A" || !movie.image) {
                    console.log(movie.image);
                    movie.image = "images/defaultPoster.svg";
                }
                return updateMovieJson(id, movie);
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
        document.getElementById("formButton").innerText = "Add Movie";
    }

    function onEditMovie(id) {
        document.getElementById("id").value = id;
        getMovieById(id)
            .then((selectedMovie) => {
                document.getElementById("title").value = selectedMovie.title;
                document.getElementById("rating").value = selectedMovie.rating;
                document.getElementById("movieSummary").value = selectedMovie.movieSummary;
                document.getElementById("genre").value = selectedMovie.genre;
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
        let cardImg = document.createElement("img");

        card.classList.add("card", "col-4", "m-1", "col-md-2");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title");
        cardRating.classList.add("card-text");
        cardSummary.classList.add("card-text");
        editMovieBtn.classList.add("btn");
        deleteMovieBtn.classList.add("btn");
        cardImg.classList.add("card-img-top");

        cardTitle.innerText = movie.title;
        cardRating.innerHTML = generateMovieRating(movie.rating);
        cardSummary.innerText = movie.movieSummary;
        editMovieBtn.innerText = "Edit";
        deleteMovieBtn.innerText = "Delete";
        cardImg.src = movie.image;

        editMovieBtn.addEventListener("click", (e) => {
            onEditMovie(movie.id);
        })
        deleteMovieBtn.addEventListener("click", (e) => {
            onDeleteMovie(movie.id);
        })


        cardBody.appendChild(cardImg);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardRating);
        cardBody.appendChild(cardSummary);
        cardBody.appendChild(editMovieBtn);
        cardBody.appendChild(deleteMovieBtn);
        card.appendChild(cardBody);

        return card;
    }

    function renderMovies(allMovies) {

        switch (currentSortOrder) {
            case "title":
                allMovies.sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                break;
            case "rating":
                allMovies.sort((a, b) => {
                    if (a.rating > b.rating) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                break;
            case "genre":
                allMovies.sort((a, b) => {
                    if (a?.genre?.toLowerCase() < b?.genre?.toLowerCase()) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                break;
        }

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
