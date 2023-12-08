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
    let searchMovieForm = document.querySelector("#search-movie-form");

    searchMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies()
    })

    searchGenreElement.addEventListener("change", function (e){
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies();
    })

    searchRatingElement.addEventListener("change", function (e){
        e.preventDefault();
        searchText = document.querySelector("#search-title").value;
        searchGenre = document.querySelector("#search-genre").value;
        searchRating = document.querySelector("#search-rating").value;
        updateShownMovies();
    })



    addMovieForm.addEventListener("submit", function (e) {
        e.preventDefault();
        formButton.setAttribute("disabled", "true")
        if (addMovieForm.id.value !== "") {
            updateMovie()
                .then(() => {
                    appendAlert('Movie updated successfully!', 'success');
                    formButton.removeAttribute("disabled");
                })
        } else {
            addMovie()
                .then((result) => {
                    appendAlert('Movie added successfully!', 'success');
                    formButton.removeAttribute("disabled");
                })
        }
    });

    function modal(mhead, mbody) {
        let modalHead = document.querySelector("#modalHead");
        let modalBody = document.querySelector("#modalBody");
        modalHead.innerText = mhead;
        modalBody.innerHTML = mbody;
        document.querySelector("#modal").classList.add("show");
        document.querySelector("#modal").style.display = "block";
        document.querySelector("#modalClose").addEventListener("click", () => {
            document.querySelector("#modal").classList.remove("show");
            document.querySelector('#modal').removeAttribute("style");
        }, {once: true});
    }

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
                    movie.imdbID = omdbResponse?.imdbID || null;
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
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
        getAllMovies()
            .then((allMovies) => {
                let filteredMovies = allMovies.filter((item, index) => {
                    let isMatch = true;
                    if(item.title.toLowerCase().indexOf(searchText.toLowerCase()) < 0){
                        isMatch = false
                    }
                    if(searchGenre !== "" && item.genre !== searchGenre) {
                        isMatch = false
                    }
                    if(searchRating !== "" && item.rating !== Number(searchRating)) {
                        isMatch = false
                    }
                    return isMatch;
                })
                renderMovies(filteredMovies);
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
                document.getElementById("title").focus();
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
            onEditMovie(movie.id);
        });

        deleteMovieBtn.addEventListener("click", (e) => {
            if (confirm("Are you sure you want to delete this item") === true) {
            onDeleteMovie(movie.id);
            }
        });

        function generateMovieCard(movieData = {}) {
            // Function to conditionally include properties in the HTML
            function addPropertyIfPresent(propertyName, propertyValue) {
                return propertyValue ? `<p class="card-text"><strong>${propertyName}:</strong> ${propertyValue}</p>` : '';
            }

            // Extract data from the JSON object
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
                Response
            } = movieData;

            // Create HTML for the movie card with Bootstrap styles
            const movieCardHTML = `
      <div class="card">
        <img id="moviePoster" src="${Poster}" class="card-img-top" alt="${Title}" onload="this.style.display='block'">
        <div class="card-body">
          <h5 class="card-title">${Title} (${Year})</h5>
          ${addPropertyIfPresent('Genre', Genre)}
          ${addPropertyIfPresent('Director', Director)}
          ${addPropertyIfPresent('Actors', Actors)}
          ${addPropertyIfPresent('Plot', Plot)}
          ${addPropertyIfPresent('Language', Language)}
          ${addPropertyIfPresent('Country', Country)}
          ${addPropertyIfPresent('Awards', Awards)}
          ${addPropertyIfPresent('Ratings', Ratings.map(rating => `${rating.Source}: ${rating.Value}`).join(', '))}
          ${addPropertyIfPresent('Metascore', Metascore)}
          ${addPropertyIfPresent('IMDb Rating', `${imdbRating}/10 (${imdbVotes} votes)`)}
          ${addPropertyIfPresent('Box Office', BoxOffice)}
          ${addPropertyIfPresent('DVD', DVD)}
          ${addPropertyIfPresent('Production', Production)}
          ${addPropertyIfPresent('Website', Website)}
        </div>
      </div>
    `;

            return movieCardHTML;
        }

        detailsBtn.addEventListener("click", (e) => {
            let mHead = movie?.title || "No title";
            let mBody = `searching...`;

            let id = movie.imdbID;

            getOmdbDataById(id)
                .then((data)=>{
                    if (data) {
                        mBody = generateMovieCard(data);
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

    // // --- welcome message------------------------
    // let mHead = "Welcome heading...";
    // let mBody = `Welcome body...`;
    // modal(mHead, mBody);
    // // --- welcome message------------------------

    updateShownMovies();

})();
