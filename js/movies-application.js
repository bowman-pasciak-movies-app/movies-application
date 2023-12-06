"use strict";

import {getAllMovies, createMovie} from "./movies-api.js";

(async ()=>{


    let allMovies = await getAllMovies();
    console.log(allMovies);

    let testMovie = {
        "title": "Shrek 2",
        "rating": 5,
        "movieSummary": "An ogre finds love"
    }
    // let newMovie = await createMovie(testMovie);
    // console.log(newMovie);


})();
