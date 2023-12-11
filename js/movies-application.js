"use strict";

import {
    getAllMovies,
    createMovie,
    updateMovieById,
    getMovieById,
    deleteMovieById,
    getOmdbDataByTitle,
    getOmdbDataById
} from "./movies-api.js";

(() => {

    let currentSortOrder = "title";
    let searchTextElement = document.querySelector("#search-title");
    let searchText = searchTextElement.value;
    let searchGenreElement = document.querySelector("#search-genre");
    let searchGenre = searchGenreElement.value;
    let searchRatingElement = document.querySelector("#search-rating");
    let searchRating = searchRatingElement.value;
    let sortByTitleButton = document.querySelector("#sort-by-title");
    let sortByRatingButton = document.querySelector("#sort-by-rating");
    let sortByGenreButton = document.querySelector("#sort-by-genre");
    let formButton = document.querySelector("#formButton");
    let addMovieBtn = document.querySelector("#add-movie-btn");
    let plotButton = document.querySelector("#plotLookUp");
    let movieSummaryElement = document.querySelector("#movieSummary");
    let movieTitle = document.querySelector("#title");

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

    addMovieBtn.addEventListener("click", (e) => {
        e.preventDefault();
        resetMovieForm();
        modalAddEdit();
    })

    plotButton.addEventListener("click", (e) => {
        e.preventDefault();
        let searchTitle = movieTitle.value.trim();
        console.log(searchTitle);
        getOmdbDataByTitle(searchTitle)
            .then((omdbResponse) => {
                console.log(omdbResponse);
                if (omdbResponse?.Error || omdbResponse?.Response === "False") {
                    appendAlert('Could not find movie!', 'danger');
                    omdbResponse = null;
                }
                if (omdbResponse) {
                    movieSummaryElement.value = omdbResponse.Plot;
                }
            })
    })

    let moviesContainerElement = document.querySelector("#rendered-movies");

    let addMovieForm = document.querySelector("#add-movie-form");

    let searchMovieForm = document.querySelector("#search-movie-form");

    searchMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies();
    })

    searchGenreElement.addEventListener("change", function (e) {
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies();
    })

    searchRatingElement.addEventListener("change", function (e) {
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies();
    })

    addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        formButton.setAttribute("disabled", "true")
        if (addMovieForm.movieId.value !== "") {
            updateMovie()
                .then(() => {
                    formButton.removeAttribute("disabled");
                    document.querySelector("#modal-add-edit").classList.remove("show");
                    document.querySelector('#modal-add-edit').removeAttribute("style");
                })
                .catch((error) => {
                    appendAlert(error.message, 'danger');
                })
        } else {
            addMovie()
                .then((result) => {
                    formButton.removeAttribute("disabled");
                    document.querySelector("#modal-add-edit").classList.remove("show");
                    document.querySelector('#modal-add-edit').removeAttribute("style");
                })
                .catch((error) => {
                    appendAlert(error.message, 'danger');
                })
        }
    });

    function modal(mhead, mbody, elements = null) {
        let modalHead = document.querySelector("#modalHead");
        let modalBody = document.querySelector("#modalBody");
        modalHead.innerText = mhead;
        modalBody.innerHTML = mbody;
        if (elements) { modalBody.appendChild(elements) }
        document.querySelector("#modal").classList.add("show");
        document.querySelector("#modal").style.display = "block";
        document.querySelector("#modalClose").addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#modal").classList.remove("show");
            document.querySelector('#modal').removeAttribute("style");
        }, { once: true });
    }

    function modalAddEdit() {
        document.querySelector("#modal-add-edit").classList.add("show");
        document.querySelector("#modal-add-edit").style.display = "block";
        document.querySelector("#modal-close-add-edit").addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#modal-add-edit").classList.remove("show");
            document.querySelector('#modal-add-edit').removeAttribute("style");
        }, { once: true });
    }

    async function addMovie() {
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim(),
            genre: addMovieForm.genre.value.trim()
        };

        return getOmdbDataByTitle(movie?.title || "")
            .then((omdbResponse) => {
                console.log(omdbResponse);
                if (omdbResponse?.Error || omdbResponse?.Response === "False") {
                    appendAlert('Could not find movie!', 'danger');
                    omdbResponse = null;
                }
                if (!omdbResponse) {
                    movie.image = "images/defaultPoster.svg";
                } else {
                    movie.image = omdbResponse.Poster;
                    movie.imdbID = omdbResponse?.imdbID || null;
                }
                if (movie.image === "N/A" || !movie.image) {
                    console.log(movie.image);
                    movie.image = "images/defaultPoster.svg";
                }
                return createMovie(movie)
                    .then(() => {
                        resetMovieForm();
                        updateShownMovies();
                        return true;
                    })
                    .catch(() => {
                        appendAlert('Could not add movie!', 'danger');
                        return false;
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
                return false;
            })
    }

    function updateMovie() {
        let id = Number(addMovieForm.movieId.value);
        let movie = {
            title: addMovieForm.title.value.trim(),
            rating: Number(addMovieForm.rating.value),
            movieSummary: addMovieForm.movieSummary.value.trim(),
            genre: addMovieForm.genre.value.trim()
        };
        return getOmdbDataByTitle(movie.title)
            .then((omdbResponse) => {
                console.log(omdbResponse);
                if (omdbResponse?.Error || omdbResponse?.Response === "False") {
                    appendAlert('Could not find movie!', 'danger');
                    omdbResponse = null;
                }
                if (!omdbResponse) {
                    movie.image = "images/defaultPoster.svg";
                } else {
                    movie.image = omdbResponse.Poster;
                    movie.imdbID = omdbResponse?.imdbID || null;
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
                </div>
            </div>`;
        return getAllMovies()
            .then((allMovies) => {
                let filteredMovies = allMovies.filter((item, index) => {
                    let isMatch = true;
                    if (item.title.toLowerCase().indexOf(searchText.toLowerCase()) < 0) {
                        isMatch = false
                    }
                    if (searchGenre !== "" && item.genre !== searchGenre) {
                        isMatch = false
                    }
                    if (searchRating !== "" && item.rating !== Number(searchRating)) {
                        isMatch = false
                    }
                    return isMatch;
                })
                renderMovies(filteredMovies);
                return true;
            })
            .catch((error) => {
                moviesContainerElement.innerHTML = "<div>Error</div>"
                appendAlert(error.message, 'danger');
                return false;
            });
    }

    function resetMovieForm() {
        addMovieForm.reset();
        document.getElementById("formButton").innerText = "Add Movie";
    }

    function onEditMovie(id) {
        document.getElementById("movieId").value = id;
        document.querySelector("#spinner-form").classList.remove("d-none");
        addMovieForm.classList.add("d-none");
        return getMovieById(id)
            .then((selectedMovie) => {
                document.getElementById("title").value = selectedMovie.title;
                document.getElementById("rating").value = selectedMovie.rating;
                document.getElementById("movieSummary").value = selectedMovie.movieSummary;
                document.getElementById("genre").value = selectedMovie.genre;
                document.getElementById("formButton").innerText = "Save Changes";
                document.querySelector("#spinner-form").classList.add("d-none");
                addMovieForm.classList.remove("d-none");
                document.getElementById("title").focus();
                return true;
            })
            .catch(() => {
                appendAlert(`Could not get movie id# ${id}!`, 'danger');
                return false;
            })
    }

    function onDeleteMovie(id) {
        id = Number(id);
        return deleteMovieById(id)
            .then(() => {
                updateShownMovies();
                return true;
            })
            .catch(() => {
                appendAlert(`Could not delete movie id# ${id}!`, 'danger');
                return false;
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
        let detailsBtn = document.createElement("button");
        let cardImg = document.createElement("img");
        let cardGenre = document.createElement("p");

        card.classList.add("card", "col-4", "mx-1", "my-2", "col-md-3");
        cardBody.classList.add("card-body");
        cardTitle.classList.add("card-title");
        cardRating.classList.add("card-text");
        cardSummary.classList.add("card-text");
        editMovieBtn.classList.add("btn");
        deleteMovieBtn.classList.add("btn");
        detailsBtn.classList.add("btn");
        cardImg.classList.add("card-img-top");
        cardGenre.classList.add("card-text");

        cardTitle.innerText = movie.title;
        cardGenre.innerText = movie?.genre || "Unknown";
        cardRating.innerHTML = generateMovieRating(movie.rating);
        cardSummary.innerText = movie.movieSummary;
        editMovieBtn.innerHTML = `<i title="Edit" class="bi bi-pencil"></i>`;
        deleteMovieBtn.innerHTML = `<i title="Delete" class="bi bi-trash"></i>`;
        detailsBtn.innerHTML = `<i title="Details" class="bi bi-info-circle"></i>`;
        cardImg.src = movie.image;

        editMovieBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetMovieForm();
            onEditMovie(movie.id);
            modalAddEdit();
        });

        deleteMovieBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let elements = document.createElement("div");
            let btn = document.createElement("button");
            btn.classList.add('btn', "custom-btn")
            btn.innerText = "Ok";
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                onDeleteMovie(movie.id);
                document.querySelector("#modal").classList.remove("show");
                document.querySelector('#modal').removeAttribute("style");
            })
            elements.appendChild(btn);
            modal("Are you sure you want to delete this movie", movie.title, elements);
        });

        function generateMovieCard(movieData = {}) {

            function addPropertyIfPresent(propertyName, propertyValue) {
                return propertyValue ? `<p class="card-text"><strong>${propertyName}:</strong> ${propertyValue}</p>` : '';
            }

            const {
                Title,
                Year,
                Rated,
                Released,
                Runtime,
                Genre,
                Director,
                Writer,
                Actors,
                Plot,
                Language,
                Country,
                Awards,
                Poster,
                Ratings,
                Metascore,
                imdbRating,
                imdbVotes,
                imdbID,
                Type,
                DVD,
                BoxOffice,
                Production,
                Website,
            } = movieData;

            // Create HTML for the movie card with Bootstrap styles
            const movieCardHTML = `
      <div class="card">
        <img id="moviePoster" src="${Poster}" class="card-img-top" alt="${Title}" onload="this.style.display='block'">
        <div class="card-body">
          <h5 class="card-title">${Title} (${Year})</h5>
          ${addPropertyIfPresent('Genre', Genre)}
          ${addPropertyIfPresent('Rated', Rated)}
          ${addPropertyIfPresent('Director', Director)}
          ${addPropertyIfPresent('Writer', Writer)}
          ${addPropertyIfPresent('Actors', Actors)}
          ${addPropertyIfPresent('Plot', Plot)}
          ${addPropertyIfPresent('Language', Language)}
          ${addPropertyIfPresent('Country', Country)}
          ${addPropertyIfPresent('Awards', Awards)}
          ${addPropertyIfPresent('Ratings', Ratings?.map(rating => `${rating.Source}: ${rating.Value}`).join(', '))}
          ${addPropertyIfPresent('Metascore', Metascore)}
          ${addPropertyIfPresent('IMDb Rating', `${imdbRating}/10 (${imdbVotes} votes)`)}
          ${addPropertyIfPresent('Box Office', BoxOffice)}
          ${addPropertyIfPresent('Released', Released)}
          ${addPropertyIfPresent('DVD', DVD)}
          ${addPropertyIfPresent('Production', Production)}
          ${addPropertyIfPresent('Runtime', Runtime)}
          ${addPropertyIfPresent('Type', Type)}
          ${addPropertyIfPresent('imdbID', imdbID)}
        </div>
      </div>
    `;

            return movieCardHTML;
        }

        detailsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let mHead = movie?.title || "No title";
            let mBody = `searching...`;

            let id = movie?.imdbID || null;

            if (!id) {
                mBody = `No details found for ${movie?.title || ""}`;
                modal(mHead, mBody);
                return;
            }

            getOmdbDataById(id)
                .then((omdbResponse) => {
                    console.log(omdbResponse);
                    if (omdbResponse?.Error || omdbResponse?.Response === "False") {
                        appendAlert('Could not find movie!', 'danger');
                        omdbResponse = null;
                    }
                    if (omdbResponse) {
                        mBody = generateMovieCard(omdbResponse);
                    } else {
                        mBody = `No details found for ${movie?.title || ""}`;
                    }
                    modal(mHead, mBody);
                })
        });

        cardBody.appendChild(cardImg);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardGenre);
        cardBody.appendChild(cardRating);
        cardBody.appendChild(cardSummary);
        cardBody.appendChild(editMovieBtn);
        cardBody.appendChild(deleteMovieBtn);
        cardBody.appendChild(detailsBtn);
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
        if(allMovies.length === 0) {
            moviesContainerElement.innerHTML = "<h2 class='text-center'>Could not find any movies.</h2>";
        }

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
