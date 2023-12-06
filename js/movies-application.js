"use strict";

import {getAllMovies} from "./movies-api.js";
(async ()=>{


    let allMovies = await getAllMovies();
    console.log(allMovies);


})();
